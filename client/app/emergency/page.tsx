"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlowingButton } from "@/components/ui/glowing-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Ambulance, AlertTriangle, MapPin, Phone, Clock, User, Heart, Info } from "lucide-react"

// Mock emergency types
const EMERGENCY_TYPES = [
  { id: "cardiac", name: "Cardiac Emergency", icon: <Heart className="h-5 w-5 text-red-500" /> },
  { id: "accident", name: "Accident/Trauma", icon: <AlertTriangle className="h-5 w-5 text-orange-500" /> },
  { id: "respiratory", name: "Respiratory Distress", icon: <Ambulance className="h-5 w-5 text-blue-500" /> },
  { id: "other", name: "Other Emergency", icon: <Info className="h-5 w-5 text-primary" /> },
]

export default function EmergencyPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const mapRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState("request")
  const [emergencyType, setEmergencyType] = useState("")
  const [location, setLocation] = useState("")
  const [patientName, setPatientName] = useState("")
  const [patientAge, setPatientAge] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [ambulanceStatus, setAmbulanceStatus] = useState<"searching" | "dispatched" | "arriving" | null>(null)
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null)
  const [ambulanceInfo, setAmbulanceInfo] = useState<{
    id: string
    driverName: string
    vehicleNumber: string
    phoneNumber: string
    location: { lat: number; lng: number }
  } | null>(null)

  // Initialize Google Maps
  useEffect(() => {
    if (typeof window !== "undefined" && mapRef.current && !mapRef.current.hasChildNodes()) {
      // Get current location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            setCurrentLocation({ lat: latitude, lng: longitude })

            // In a real app, we would initialize the Google Maps here
            // For now, we'll just simulate it
            const mapElement = document.createElement("div")
            mapElement.className = "h-full w-full bg-gray-200 rounded-lg relative overflow-hidden"
            mapElement.innerHTML = `
              <div class="absolute inset-0 bg-blue-50 flex items-center justify-center">
                <div class="text-center p-4">
                  <p class="text-sm text-muted-foreground mb-2">Map View</p>
                  <p class="text-xs text-muted-foreground">Current Location: ${latitude.toFixed(
                    6,
                  )}, ${longitude.toFixed(6)}</p>
                </div>
              </div>
            `
            mapRef.current.appendChild(mapElement)

            // Set location address based on coordinates
            setLocation("Current Location (Auto-detected)")
          },
          (error) => {
            console.error("Error getting location:", error)
            toast({
              title: "Location Error",
              description: "Unable to get your current location. Please enter it manually.",
              variant: "destructive",
            })
          },
        )
      }
    }
  }, [toast])

  // Simulate ambulance dispatch and tracking
  useEffect(() => {
    if (requestSuccess && ambulanceStatus === "searching") {
      // Simulate finding an ambulance after 3 seconds
      const timer = setTimeout(() => {
        setAmbulanceStatus("dispatched")
        setAmbulanceInfo({
          id: "AMB-1234",
          driverName: "Rajesh Kumar",
          vehicleNumber: "DL 01 AB 1234",
          phoneNumber: "+91 9876543210",
          location: {
            lat: currentLocation?.lat ? currentLocation.lat - 0.02 : 28.61,
            lng: currentLocation?.lng ? currentLocation.lng - 0.01 : 77.21,
          },
        })
        setEstimatedTime(12)
      }, 3000)

      return () => clearTimeout(timer)
    }

    if (ambulanceStatus === "dispatched" && estimatedTime) {
      // Simulate ambulance movement
      const interval = setInterval(() => {
        setEstimatedTime((prev) => {
          if (prev && prev <= 1) {
            setAmbulanceStatus("arriving")
            clearInterval(interval)
            return 0
          }
          return prev ? prev - 1 : null
        })

        // Update ambulance location
        if (ambulanceInfo && currentLocation) {
          setAmbulanceInfo((prev) => {
            if (!prev || !currentLocation) return prev

            // Move ambulance closer to the destination
            const newLat = prev.location.lat + (currentLocation.lat - prev.location.lat) * 0.2
            const newLng = prev.location.lng + (currentLocation.lng - prev.location.lng) * 0.2

            return {
              ...prev,
              location: { lat: newLat, lng: newLng },
            }
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [requestSuccess, ambulanceStatus, estimatedTime, ambulanceInfo, currentLocation])

  // Handle emergency request submission
  const handleSubmitRequest = async () => {
    if (!emergencyType || !location || !patientName || !contactNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call to request an ambulance
      // await fetch('/api/emergency', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     emergencyType,
      //     location,
      //     patientName,
      //     patientAge,
      //     contactNumber,
      //     additionalInfo,
      //     coordinates: currentLocation,
      //     userId: user?.uid,
      //   }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setRequestSuccess(true)
      setAmbulanceStatus("searching")

      toast({
        title: "Emergency request sent",
        description: "We're dispatching the nearest ambulance to your location.",
      })

      // Switch to tracking tab
      setActiveTab("track")
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was a problem sending your emergency request. Please try again or call emergency services directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container px-4 md:px-6 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2 mb-8"
      >
        <Badge className="w-fit bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800">
          Emergency
        </Badge>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400">
          Emergency Ambulance Service
        </h1>
        <p className="text-muted-foreground">Request and track emergency medical services</p>
      </motion.div>

      <Alert className="mb-6 border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          If this is a life-threatening emergency, please call 102 or your local emergency number immediately.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        <TabsList className="bg-primary/10 p-1">
          <TabsTrigger
            value="request"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            Request Ambulance
          </TabsTrigger>
          <TabsTrigger
            value="track"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            disabled={!requestSuccess}
          >
            Track Ambulance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="request" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-[1fr_400px]">
            <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Emergency Details</CardTitle>
                <CardDescription>Provide information about the emergency situation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency-type">Emergency Type</Label>
                  <Select value={emergencyType} onValueChange={setEmergencyType}>
                    <SelectTrigger
                      id="emergency-type"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                    >
                      <SelectValue placeholder="Select emergency type" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMERGENCY_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id} className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            {type.icon}
                            <span>{type.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="flex gap-2">
                    <Input
                      id="location"
                      placeholder="Current address"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => {
                        if (navigator.geolocation) {
                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              const { latitude, longitude } = position.coords
                              setCurrentLocation({ lat: latitude, lng: longitude })
                              setLocation("Current Location (Auto-detected)")
                              toast({
                                title: "Location updated",
                                description: "Using your current location.",
                              })
                            },
                            (error) => {
                              toast({
                                title: "Location Error",
                                description: "Unable to get your current location. Please enter it manually.",
                                variant: "destructive",
                              })
                            },
                          )
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Use Current
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patient-name">Patient Name</Label>
                    <Input
                      id="patient-name"
                      placeholder="Full name"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patient-age">Patient Age</Label>
                    <Input
                      id="patient-age"
                      placeholder="Age"
                      type="number"
                      className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contact-number">Contact Number</Label>
                  <Input
                    id="contact-number"
                    placeholder="Phone number"
                    className="border-primary/20 bg-primary/5 focus-visible:ring-primary"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-info">Additional Information</Label>
                  <Textarea
                    id="additional-info"
                    placeholder="Describe the emergency situation, any medical conditions, etc."
                    className="min-h-[100px] border-primary/20 bg-primary/5 focus-visible:ring-primary"
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <GlowingButton className="w-full" disabled={isSubmitting} onClick={handleSubmitRequest}>
                  {isSubmitting ? "Sending Request..." : "Request Emergency Ambulance"}
                </GlowingButton>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Location Map</CardTitle>
                  <CardDescription>Your current location will be sent to emergency services</CardDescription>
                </CardHeader>
                <CardContent>
                  <div ref={mapRef} className="h-[300px] w-full rounded-lg overflow-hidden bg-muted"></div>
                </CardContent>
              </Card>

              <Card className="border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Ambulance</p>
                      <p className="text-sm">National Emergency</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900"
                      onClick={() => window.open("tel:102")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      102
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Police</p>
                      <p className="text-sm">Emergency Services</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900"
                      onClick={() => window.open("tel:100")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      100
                    </Button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Fire</p>
                      <p className="text-sm">Emergency Services</p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900"
                      onClick={() => window.open("tel:101")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      101
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="track" className="space-y-6">
          {ambulanceStatus === "searching" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center p-6 text-center"
            >
              <div className="relative h-24 w-24 mb-6">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping"></div>
                <div className="relative flex items-center justify-center h-full w-full rounded-full bg-primary/10 border border-primary/30">
                  <Ambulance className="h-12 w-12 text-primary" />
                </div>
              </div>
              <h2 className="text-xl font-semibold mb-2">Finding Nearest Ambulance</h2>
              <p className="text-muted-foreground mb-6">
                We're locating the closest available ambulance to your location. This usually takes less than a minute.
              </p>
              <div className="w-full max-w-md h-2 bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3 }}
                ></motion.div>
              </div>
            </motion.div>
          )}

          {(ambulanceStatus === "dispatched" || ambulanceStatus === "arriving") && ambulanceInfo && (
            <div className="grid gap-6 md:grid-cols-[1fr_400px]">
              <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="mb-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800">
                        {ambulanceStatus === "dispatched" ? "On the way" : "Arriving now"}
                      </Badge>
                      <CardTitle>Ambulance #{ambulanceInfo.id}</CardTitle>
                      <CardDescription>
                        {ambulanceStatus === "dispatched"
                          ? `Estimated arrival in ${estimatedTime} minutes`
                          : "The ambulance has arrived at your location"}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      className="border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => window.open(`tel:${ambulanceInfo.phoneNumber}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Driver
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Driver Name</p>
                      <p className="font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        {ambulanceInfo.driverName}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Vehicle Number</p>
                      <p className="font-medium flex items-center gap-2">
                        <Ambulance className="h-4 w-4 text-primary" />
                        {ambulanceInfo.vehicleNumber}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Contact Number</p>
                      <p className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary" />
                        {ambulanceInfo.phoneNumber}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Estimated Time</p>
                      <p className="font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {ambulanceStatus === "dispatched" ? `${estimatedTime} minutes` : "Arrived"}
                      </p>
                    </div>
                  </div>

                  <div className="h-[300px] w-full rounded-lg overflow-hidden bg-muted relative">
                    {/* This would be a Google Maps component in a real app */}
                    <div className="absolute inset-0 bg-blue-50 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-red-500 border-2 border-white z-10"></div>
                        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-blue-500 border-2 border-white z-10 animate-pulse"></div>
                        {ambulanceStatus === "dispatched" && (
                          <motion.div
                            className="absolute h-6 w-6 rounded-full bg-blue-500 border-2 border-white z-10"
                            initial={{ top: "25%", left: "25%" }}
                            animate={{ top: "50%", left: "50%" }}
                            transition={{ duration: estimatedTime || 10, ease: "linear" }}
                          >
                            <Ambulance className="h-4 w-4 text-white" />
                          </motion.div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">Interactive map with real-time tracking</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Emergency Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Emergency Type</p>
                      <p className="font-medium">
                        {EMERGENCY_TYPES.find((type) => type.id === emergencyType)?.name || "Medical Emergency"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">{location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Patient</p>
                      <p className="font-medium">
                        {patientName} {patientAge ? `(${patientAge} years)` : ""}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{contactNumber}</p>
                    </div>
                    {additionalInfo && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Additional Information</p>
                        <p className="text-sm">{additionalInfo}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-primary/20 bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle>Destination Hospital</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Aeternum General Hospital</p>
                        <p className="text-sm text-muted-foreground">2.5 km away</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Address</p>
                      <p className="text-sm">123 Healthcare Avenue, New Delhi, 110001</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Emergency Contact</p>
                      <p className="text-sm">+91 11 2345 6789</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full border-primary/20 bg-primary/5 hover:bg-primary/10"
                      onClick={() => {
                        // In a real app, this would open Google Maps with directions
                        window.open("https://maps.google.com")
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

