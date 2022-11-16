import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

async function main(){
  const user = await prisma.user.create({
    data:{
      name:'John Doe',
      email: 'johndoe@gmail.com',
      avatarUrl: 'https://github.com/IsabellePinheiro.png'
    }
  })

  const pool = await prisma.pool.create({
    data:{
      title:'Example Pool',
      code:'BOL123',
      ownerId:user.id,
      participants:{
        create:{
          userId: user.id
        }
      }
    }

  
  })

  await prisma.game.create({
      data:{
        date: '2022-11-03T18:04:15.398Z',
        firstTeamCountryCode: 'DE',
        secondTeamCountryCode:'BR'
      }
  })

  await prisma.game.create({
    data:{
      date: '2022-11-05T18:04:15.398Z',
      firstTeamCountryCode: 'BR',
      secondTeamCountryCode:'AR',
      guesses:{
        create:{
          firstTeamPoints:2,
          secondTeamPoints:1,
          participant:{
            connect:{
              userId_poolId:{
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
})
}

main()