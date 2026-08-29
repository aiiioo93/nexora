import prisma from "../lib/prisma"

async function main() {
  console.log("Création des données NEXORA...")

  // CLIENTS
  await prisma.client.createMany({
    data: [
      {
        name: "Sophie Martin",
        email: "sophie.martin@nexora-demo.fr",
        phone: "06 10 20 30 01",
        company: "Novatek Industries",
      },
      {
        name: "Karim Benali",
        email: "karim.benali@nexora-demo.fr",
        phone: "06 10 20 30 02",
        company: "Atlas Distribution",
      },
      {
        name: "Aminata Diop",
        email: "aminata.diop@nexora-demo.fr",
        phone: "06 10 20 30 03",
        company: "Sunu Market",
      },
      {
        name: "Thomas Leroy",
        email: "thomas.leroy@nexora-demo.fr",
        phone: "06 10 20 30 04",
        company: "Lumeo Retail",
      },
      {
        name: "Fatou Ndiaye",
        email: "fatou.ndiaye@nexora-demo.fr",
        phone: "06 10 20 30 05",
        company: "Teranga Services",
      },
      {
        name: "Julien Moreau",
        email: "julien.moreau@nexora-demo.fr",
        phone: "06 10 20 30 06",
        company: "Orion Technologies",
      },
      {
        name: "Mariam Traore",
        email: "mariam.traore@nexora-demo.fr",
        phone: "06 10 20 30 07",
        company: "Sahel Connect",
      },
      {
        name: "Alexandre Petit",
        email: "alexandre.petit@nexora-demo.fr",
        phone: "06 10 20 30 08",
        company: "Hexa Commerce",
      },
      {
        name: "Awa Ba",
        email: "awa.ba@nexora-demo.fr",
        phone: "06 10 20 30 09",
        company: "Jambar Distribution",
      },
      {
        name: "Lucas Bernard",
        email: "lucas.bernard@nexora-demo.fr",
        phone: "06 10 20 30 10",
        company: "Arko Solutions",
      },
    ],
    skipDuplicates: true,
  })

  // CHAUFFEURS
  await prisma.driver.createMany({
    data: [
      {
        firstName: "Mamadou",
        lastName: "Diallo",
        email: "mamadou.diallo@nexora-demo.fr",
        phone: "06 20 30 40 01",
        licenseNumber: "NX-PER-001",
        status: "AVAILABLE",
      },
      {
        firstName: "Ibrahima",
        lastName: "Sy",
        email: "ibrahima.sy@nexora-demo.fr",
        phone: "06 20 30 40 02",
        licenseNumber: "NX-PER-002",
        status: "AVAILABLE",
      },
      {
        firstName: "Ousmane",
        lastName: "Ba",
        email: "ousmane.ba@nexora-demo.fr",
        phone: "06 20 30 40 03",
        licenseNumber: "NX-PER-003",
        status: "AVAILABLE",
      },
      {
        firstName: "Alioune",
        lastName: "Ndiaye",
        email: "alioune.ndiaye@nexora-demo.fr",
        phone: "06 20 30 40 04",
        licenseNumber: "NX-PER-004",
        status: "AVAILABLE",
      },
      {
        firstName: "Moussa",
        lastName: "Traore",
        email: "moussa.traore@nexora-demo.fr",
        phone: "06 20 30 40 05",
        licenseNumber: "NX-PER-005",
        status: "AVAILABLE",
      },
      {
        firstName: "Cheikh",
        lastName: "Fall",
        email: "cheikh.fall@nexora-demo.fr",
        phone: "06 20 30 40 06",
        licenseNumber: "NX-PER-006",
        status: "AVAILABLE",
      },
      {
        firstName: "Samba",
        lastName: "Camara",
        email: "samba.camara@nexora-demo.fr",
        phone: "06 20 30 40 07",
        licenseNumber: "NX-PER-007",
        status: "AVAILABLE",
      },
      {
        firstName: "Abdoulaye",
        lastName: "Sow",
        email: "abdoulaye.sow@nexora-demo.fr",
        phone: "06 20 30 40 08",
        licenseNumber: "NX-PER-008",
        status: "AVAILABLE",
      },
      {
        firstName: "Boubacar",
        lastName: "Kane",
        email: "boubacar.kane@nexora-demo.fr",
        phone: "06 20 30 40 09",
        licenseNumber: "NX-PER-009",
        status: "AVAILABLE",
      },
      {
        firstName: "Amadou",
        lastName: "Gueye",
        email: "amadou.gueye@nexora-demo.fr",
        phone: "06 20 30 40 10",
        licenseNumber: "NX-PER-010",
        status: "AVAILABLE",
      },
    ],
    skipDuplicates: true,
  })

  // VEHICULES
  await prisma.vehicle.createMany({
    data: [
      {
        registration: "NX-101-AA",
        brand: "Renault",
        model: "Master",
        year: 2023,
        mileage: 82410,
        status: "AVAILABLE",
      },
      {
        registration: "NX-102-BB",
        brand: "Mercedes",
        model: "Sprinter",
        year: 2022,
        mileage: 65420,
        status: "AVAILABLE",
      },
      {
        registration: "NX-103-CC",
        brand: "Ford",
        model: "Transit",
        year: 2024,
        mileage: 24120,
        status: "AVAILABLE",
      },
      {
        registration: "NX-104-DD",
        brand: "Iveco",
        model: "Daily",
        year: 2021,
        mileage: 112500,
        status: "AVAILABLE",
      },
      {
        registration: "NX-105-EE",
        brand: "Peugeot",
        model: "Boxer",
        year: 2023,
        mileage: 47500,
        status: "AVAILABLE",
      },
      {
        registration: "NX-106-FF",
        brand: "Citroen",
        model: "Jumper",
        year: 2022,
        mileage: 71800,
        status: "AVAILABLE",
      },
      {
        registration: "NX-107-GG",
        brand: "Fiat",
        model: "Ducato",
        year: 2024,
        mileage: 18900,
        status: "AVAILABLE",
      },
      {
        registration: "NX-108-HH",
        brand: "Volkswagen",
        model: "Crafter",
        year: 2023,
        mileage: 36900,
        status: "AVAILABLE",
      },
      {
        registration: "NX-109-JJ",
        brand: "Renault",
        model: "Trafic",
        year: 2022,
        mileage: 58400,
        status: "AVAILABLE",
      },
      {
        registration: "NX-110-KK",
        brand: "Mercedes",
        model: "Vito",
        year: 2023,
        mileage: 41300,
        status: "AVAILABLE",
      },
    ],
    skipDuplicates: true,
  })

  const clients = await prisma.client.count()
  const drivers = await prisma.driver.count()
  const vehicles = await prisma.vehicle.count()

  console.log("")
  console.log("Seed terminé ✅")
  console.log(`Clients : ${clients}`)
  console.log(`Chauffeurs : ${drivers}`)
  console.log(`Véhicules : ${vehicles}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
