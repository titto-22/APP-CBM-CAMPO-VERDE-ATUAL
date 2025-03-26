const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {

  /* 
  //Consulta todos os usuários
  const allUsers = await prisma.user.findMany()
  console.log(allUsers)
  */

  
  /*
  await prisma.user.create({
    data: {
      userName: 'Humberto',
      cpf:'04404846185',
      addressFull:'TES TES TESTE',
      telephone:'5565996452787',
      email: 'humberto@prisma.io',
      password:'123',
    }
  })
  
  
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
    addressFull:'tfetcfwx stfdxtax agsvcjgasdv bvcahsbvchsax vcsavcjqsvc dsvcghsvadjgcvsaq',
    description: 'Esta se afogando no rio seco'
  },
})


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
*/
 




//Fazer update
const post = await prisma.user.update({
  where: { id: 1 },
  data: { password: '789456123' },
})




//const teste = await prisma.user.findMany()


const allUsers = await prisma.user.findMany()


  const allMaster = await prisma.master.findMany()
  const allVehicle = await prisma.vehicle.findMany()
  const allOccurrence = await prisma.occurrence.findMany()
  const allStatus = await prisma.status.findMany()
  const allUsersAndDate = await prisma.user.findMany({
    include:{
      Vehicle:true,
      Occurrence:true,
    }
  })


  console.log(allMaster)
  console.log(allVehicle)
  console.log(allOccurrence)
  console.log(allStatus)
  
  
  console.dir(allUsersAndDate, { depth: null })
  
 
 //console.log(teste)
 
 console.log(allUsers)

  

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