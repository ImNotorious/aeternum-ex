import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow hospital staff and admins to access ambulance data
    if (!session || (session.user.role !== "hospital" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const id = searchParams.get("id")

    const client = await clientPromise
    const db = client.db("aeternum")

    if (id) {
      // Get specific ambulance
      const ambulance = await db.collection("ambulances").findOne({
        _id: new ObjectId(id),
      })

      if (!ambulance) {
        return NextResponse.json({ error: "Ambulance not found" }, { status: 404 })
      }

      return NextResponse.json(ambulance)
    }

    // Get all ambulances with optional status filter
    let query = {}
    if (status) {
      query = { status }
    }

    const ambulances = await db.collection("ambulances").find(query).toArray()

    return NextResponse.json(ambulances)
  } catch (error) {
    console.error("Error fetching ambulances:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow hospital staff and admins to update ambulance data
    if (!session || (session.user.role !== "hospital" && session.user.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.id) {
      return NextResponse.json({ error: "Missing ambulance ID" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("aeternum")

    // Update ambulance status
    const updateData: any = {}

    if (data.status) updateData.status = data.status
    if (data.location) updateData.location = data.location
    if (data.driverName) updateData.driverName = data.driverName
    if (data.vehicleNumber) updateData.vehicleNumber = data.vehicleNumber
    if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber
    if (data.lastService) updateData.lastService = new Date(data.lastService)

    updateData.lastUpdated = new Date()

    const result = await db.collection("ambulances").updateOne({ _id: new ObjectId(data.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Ambulance not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Ambulance updated successfully" })
  } catch (error) {
    console.error("Error updating ambulance:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

