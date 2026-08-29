import prisma from "../lib/prisma"

async function main() {
  const clients = await prisma.client.findMany()

  console.log("Liste des clients :")
  console.log(clients)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })