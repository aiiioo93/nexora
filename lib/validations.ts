import { z } from "zod"

export const clientSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  company: z.string().trim().optional(),
})

export const driverStatusSchema = z.enum([
  "AVAILABLE",
  "ON_DELIVERY",
  "OFF_DUTY",
])

export const driverSchema = z.object({
  firstName: z.string().trim().min(2),
  lastName: z.string().trim().min(2),
  email: z.string().trim().email(),
  phone: z.string().trim().optional(),
  licenseNumber: z.string().trim().min(3),
  status: driverStatusSchema,
})

export const vehicleStatusSchema = z.enum([
  "AVAILABLE",
  "ON_DELIVERY",
  "MAINTENANCE",
  "OUT_OF_SERVICE",
])

export const vehicleSchema = z.object({
  registration: z.string().trim().min(2),
  brand: z.string().trim().min(2),
  model: z.string().trim().min(1),
  year: z.coerce.number().int().min(1900).max(2100),
  mileage: z.coerce.number().int().min(0),
  status: vehicleStatusSchema,
})

export const deliverySchema = z.object({
  origin: z.string().trim().min(2),
  destination: z.string().trim().min(2),
  clientId: z.coerce.number().int().positive(),
  driverId: z.coerce.number().int().positive(),
  vehicleId: z.coerce.number().int().positive(),
  scheduledAt: z.coerce.date(),
  notes: z.string().trim().optional(),
})

export const deliveryStatusSchema = z.enum([
  "ASSIGNED",
  "IN_TRANSIT",
  "DELAYED",
  "DELIVERED",
  "CANCELLED",
])

export type DeliveryInput = z.infer<typeof deliverySchema>
export type DeliveryStatusInput = z.infer<typeof deliveryStatusSchema>
