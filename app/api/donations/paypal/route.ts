import { NextResponse } from "next/server"
import { z } from "zod"
import { sql, generateId } from "@/lib/db"

// Donation schema validation with more flexible email handling
const paypalDonationSchema = z.object({
  orderID: z.string(),
  paypalTransactionID: z.string(),
  amount: z.number().min(1),
  name: z.string(),
  // Make email more flexible - it can be a valid email, empty string, or undefined
  email: z.union([z.string().email(), z.string().length(0), z.undefined()]).optional(),
  message: z.string().optional(),
  anonymous: z.boolean().optional(),
  donationType: z.enum(["one-time", "supporter", "innovator", "pioneer", "visionary"]),
})

export async function POST(req: Request) {
  try {
    // Log the request body for debugging
    const body = await req.json()
    console.log("PayPal donation request body:", body)

    // Parse with more lenient validation
    const validatedData = paypalDonationSchema.parse(body)

    // Extract fields with proper handling for email
    const { orderID, paypalTransactionID, amount, name, email, message, anonymous, donationType } = validatedData

    // Verify PayPal transaction (NEW ADDITION)
    try {
      const verified = await verifyPayPalTransaction(orderID, amount)
      if (!verified) {
        console.error("PayPal transaction verification failed")
        return NextResponse.json({ error: "Transaction verification failed" }, { status: 400 })
      }
    } catch (verifyError) {
      console.error("Error verifying PayPal transaction:", verifyError)
      return NextResponse.json({ error: "Transaction verification error" }, { status: 500 })
    }

    // Generate a unique ID for the donation
    const id = generateId()

    // Store donation in database - ensure email is null if it's empty or invalid
    const emailToStore = email && email.length > 0 ? email : null

    try {
      await sql`
        INSERT INTO donations (
          id, amount, name, email, message, anonymous, donation_type, status, 
          stripe_session_id, paypal_transaction_id, paid_at, created_at, updated_at
        )
        VALUES (
          ${id}, ${amount}, ${name}, ${emailToStore}, ${message || null}, 
          ${anonymous || false}, ${donationType}, 'completed', 
          null, ${paypalTransactionID}, NOW(), NOW(), NOW()
        )
      `
      console.log("Donation successfully recorded in database, ID:", id)
      return NextResponse.json({ success: true })
    } catch (sqlError) {
      console.error("Database error:", sqlError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }
  } catch (error) {
    console.error("PayPal donation error:", error)

    // More detailed error logging
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", JSON.stringify(error.errors, null, 2))
    }

    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
  }
}

// NEW FUNCTION: Verify the PayPal transaction is valid
async function verifyPayPalTransaction(orderId: string, expectedAmount: number): Promise<boolean> {
  // Get the access token
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const clientSecret = process.env.PAYPAL_SECRET
  
  if (!clientId || !clientSecret) {
    console.error("Missing PayPal API credentials")
    return false
  }
  
  // Get access token
  const tokenResponse = await fetch(
    `https://api-m.${process.env.NODE_ENV === 'production' ? 'paypal.com' : 'sandbox.paypal.com'}/v1/oauth2/token`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    }
  )
  
  if (!tokenResponse.ok) {
    console.error("Failed to get PayPal access token:", await tokenResponse.text())
    return false
  }
  
  const { access_token } = await tokenResponse.json()
  
  // Verify the order
  const domain = process.env.NODE_ENV === 'production' ? 'paypal.com' : 'sandbox.paypal.com'
  const verifyResponse = await fetch(`https://api-m.${domain}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
  })
  
  if (!verifyResponse.ok) {
    console.error("PayPal API error:", await verifyResponse.text())
    return false
  }
  
  const orderData = await verifyResponse.json()
  
  // Check order status
  if (orderData.status !== 'COMPLETED') {
    console.error("Order is not completed. Status:", orderData.status)
    return false
  }
  
  // Verify amount
  const paymentUnit = orderData.purchase_units?.[0]
  const capturedAmount = paymentUnit?.payments?.captures?.[0]?.amount?.value
  
  if (!capturedAmount) {
    console.error("Could not find captured amount in PayPal response")
    return false
  }
  
  // Compare amounts (PayPal returns amount as string)
  if (parseFloat(capturedAmount) !== expectedAmount) {
    console.error(`Amount mismatch: expected ${expectedAmount}, got ${capturedAmount}`)
    return false
  }
  
  return true
}


// import { NextResponse } from "next/server"
// import { z } from "zod"
// import { sql, generateId } from "@/lib/db"

// // Donation schema validation with more flexible email handling
// const paypalDonationSchema = z.object({
//   orderID: z.string(),
//   paypalTransactionID: z.string(),
//   amount: z.number().min(1),
//   name: z.string(),
//   // Make email more flexible - it can be a valid email, empty string, or undefined
//   email: z.union([z.string().email(), z.string().length(0), z.undefined()]).optional(),
//   message: z.string().optional(),
//   anonymous: z.boolean().optional(),
//   donationType: z.enum(["one-time", "supporter", "innovator", "pioneer", "visionary"]),
// })

// export async function POST(req: Request) {
//   try {
//     // Log the request body for debugging
//     const body = await req.json()
//     console.log("PayPal donation request body:", body)

//     // Parse with more lenient validation
//     const validatedData = paypalDonationSchema.parse(body)

//     // Extract fields with proper handling for email
//     const { orderID, paypalTransactionID, amount, name, email, message, anonymous, donationType } = validatedData

//     // Generate a unique ID for the donation
//     const id = generateId()

//     // Store donation in database - ensure email is null if it's empty or invalid
//     const emailToStore = email && email.length > 0 ? email : null

//     await sql`
//       INSERT INTO donations (
//         id, amount, name, email, message, anonymous, donation_type, status, 
//         stripe_session_id, paypal_transaction_id, paid_at, created_at, updated_at
//       )
//       VALUES (
//         ${id}, ${amount}, ${name}, ${emailToStore}, ${message || null}, 
//         ${anonymous || false}, ${donationType}, 'completed', 
//         null, ${paypalTransactionID}, NOW(), NOW(), NOW()
//       )
//     `

//     return NextResponse.json({ success: true })
//   } catch (error) {
//     console.error("PayPal donation error:", error)

//     // More detailed error logging
//     if (error instanceof z.ZodError) {
//       console.error("Validation errors:", JSON.stringify(error.errors, null, 2))
//     }

//     return NextResponse.json({ error: "Failed to process donation" }, { status: 500 })
//   }
// }