"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  userRole: string | null
  loading: boolean
  signUp: (email: string, password: string, name: string, role?: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signInAsHospital: (email: string, password: string) => Promise<void>
  signInWithGoogle: (isHospital?: boolean) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  signUp: async () => {},
  signIn: async () => {},
  signInAsHospital: async () => {},
  signInWithGoogle: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        // Get user role from Firestore
        try {
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            const role = userDoc.data().role || "patient"
            setUserRole(role)
            console.log("User role set to:", role) // Debug log
          } else {
            // Create user document if it doesn't exist
            await setDoc(userDocRef, {
              email: user.email,
              name: user.displayName,
              role: "patient", // Default role
              createdAt: new Date(),
            })
            setUserRole("patient")
          }
        } catch (error) {
          console.error("Error getting user role:", error)
          setUserRole("patient") // Default to patient role
        }
      } else {
        setUserRole(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name: string, role = "patient") => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update profile with name
      await updateProfile(user, { displayName: name })

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        name,
        role,
        createdAt: new Date(),
      })

      setUserRole(role)
    } catch (error) {
      console.error("Error during signup:", error)
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      console.error("Error during sign in:", error)
      throw error
    }
  }

  const signInAsHospital = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Verify if user has hospital role
      const userDoc = await getDoc(doc(db, "users", user.uid))

      if (!userDoc.exists() || userDoc.data().role !== "hospital") {
        await signOut(auth)
        throw new Error("Unauthorized: Not a hospital staff account")
      }

      setUserRole("hospital")
    } catch (error) {
      console.error("Error during hospital sign in:", error)
      throw error
    }
  }

  const signInWithGoogle = async (isHospital?: boolean) => {
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user document already exists
      const userDocRef = doc(db, "users", user.uid)
      const userDoc = await getDoc(userDocRef)

      const role = isHospital ? "hospital" : "patient"

      // If user exists, update the role if needed
      if (userDoc.exists()) {
        // Only update if the role is different or if explicitly setting as hospital
        if (isHospital || userDoc.data().role !== role) {
          await setDoc(
            userDocRef,
            {
              role: role,
              updatedAt: new Date(),
            },
            { merge: true },
          )
        }
      } else {
        // Create new user document
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: role,
          createdAt: new Date(),
        })
      }

      // Set the role in state immediately
      setUserRole(role)
      setLoading(false)

      return user
    } catch (error) {
      setLoading(false)
      console.error("Google sign in error:", error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userRole,
        loading,
        signUp,
        signIn,
        signInAsHospital,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

