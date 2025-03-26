import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.appointmentId || !data.amount || !data.paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("hospital")

    // Check if appointment exists
    const appointment = await db.collection("appointments").findOne({
      _id: data.appointmentId,
    })

    if (!appointment) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 })
    }

    // Create payment record
    const payment = {
      appointmentId: data.appointmentId,
      patientId: session.user.id,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: "completed",
      transactionId: data.transactionId || `TXN-${Date.now()}`,
      createdAt: new Date(),
    }

    const result = await db.collection("payments").insertOne(payment)

    // Update appointment payment status
    await db
      .collection("appointments")
      .updateOne({ _id: data.appointmentId }, { $set: { paymentStatus: "paid", paymentId: result.insertedId } })

    return NextResponse.json(
      {
        id: result.insertedId,
        ...payment,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error processing payment:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

