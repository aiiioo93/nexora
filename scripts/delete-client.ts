import prisma from "../lib/prisma"

async function main() {
  const client = await prisma.client.delete({
    where: {
      email: "sophie.martin@nexora-demo.fr",
    },
  })

  console.log("Client supprimé :", client)
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })