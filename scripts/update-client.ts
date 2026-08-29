import prisma from "../lib/prisma"

async function main() {
  const client = await prisma.client.update({
    where: {
      email: "sophie.martin@nexora-demo.fr",
    },
    data: {
      phone: "06 98 76 54 32",
      company: "Novatek Logistics",
    },
  })

  console.log("Client modifié :", client)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })