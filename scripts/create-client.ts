import prisma from "../lib/prisma"

async function main() {
  const client = await prisma.client.create({
    data: {
      name: "Sophie Martin",
      email: "sophie.martin@nexora-demo.fr",
      phone: "06 12 34 56 78",
      company: "Novatek Industries",
    },
  })

  console.log("Client créé :", client)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })