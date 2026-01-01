import { PrismaClient } from '@prisma/client';
import generoiSaunavuorot from '../prisma/scripts/generoiSaunavuorot';

const seedIfEmpty = async () : Promise<void> => {
    
    const prisma : PrismaClient = new PrismaClient();
    const count = await prisma.saunavuoro.count();
    
    if (count === 0) {
        await generoiSaunavuorot();
        console.log('Saunavuorot generoitu.');
    } else {
        console.log('Saunavuoroja löytyy jo, ei generoitu.');
    }
}

export default seedIfEmpty;