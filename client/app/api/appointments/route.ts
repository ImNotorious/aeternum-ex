import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const doctorId = searchParams.get("doctorId")

    const client = await clientPromise
    const db = client.db("hospital")

    let query = {}

    if (userId) {
      query = { ...query, patientId: userId }
    }

    if (doctorId) {
      query = { ...query, doctorId }
    }

    const appointments = await db.collection("appointments").find(query).toArray()

    return NextResponse.json(appointments)
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.doctorId || !data.date || !data.time || !data.patientId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("hospital")

    // Check if appointment slot is available
    const existingAppointment = await db.collection("appointments").findOne({
      doctorId: data.doctorId,
      date: data.date,
      time: data.time,
      status: { $ne: "cancelled" },
    })

    if (existingAppointment) {
      return NextResponse.json({ error: "Appointment slot is already booked" }, { status: 409 })
    }

    // Create new appointment
    const appointment = {
      ...data,
      status: "confirmed",
      createdAt: new Date(),
    }

    const result = await db.collection("appointments").insertOne(appointment)

    return NextResponse.json(
      {
        id: result.insertedId,
        ...appointment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

