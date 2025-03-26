const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  /*
 await prisma.user.create({
    data: {
      userName: 'Caio',
      cpf:'02233910001',
      addressFull:'TES TES TESTE',
      telephone:'5565996452787',
      email: 'caio@prisma.io',
      password:'123',
      MasterUser:{
        create:{
          matricula:'123456798',
          position:'Tenente',
          createdNewUser:true,
          createdByUserId:1
        }
      }
    },
  })
*/

/*
await prisma.vehicle.create({
  data: {
    placa: 'Caio54165',
    type:'Ambulância',
    model:'Citroen - van',
    description:'van',
    userId:2
  },
})
*/

/*
await prisma.occurrence.create({
  data: {
    userId:2,
    natOco:'Afogamento',
    geoLat:123456,
    geoLong:123456,
    addressLong:'tfetcfwx stfdxtax agsvcjgasdv bvcahsbvchsax vcsavcjqsvc dsvcghsvadjgcvsaq',
    Description: 'Esta se afogando no rio seco'
  },
})
*/
await prisma.incidentResponse.create({
  data: {
    userId:2,
    occurrenceId:1,
    vehicleId:1,
    Status:{
      create:{
        statusIncidentResponse:'INICIO',
        description:'Iniciado atendimento, ambulancia a caminho'
      }
    }
  },
})

/*
  const allMaster = await prisma.master.findMany()
  const allUsers = await prisma.user.findMany()
  const allVehicle = await prisma.vehicle.findMany()
  const allOccurrence = await prisma.occurrence.findMany()
  const allStatus = await prisma.status.findMany()
  */
  const allUsersAndDate = await prisma.user.findMany({
    include:{
      Vehicle:true,
      Occurrence:true,
    }
  })
  /*
  console.log(allUsers)
  console.log(allMaster)
  console.log(allVehicle)
  console.log(allOccurrence)
  console.log(allStatus)
  */
  console.dir(allUsersAndDate, { depth: null })
  

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })