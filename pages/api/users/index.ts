import {prisma} from '../../../config/db'

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
            return await getUsers(req, res)
            break;

        case 'POST':
            return await addUser(req, res)
            break;
    
        default:
            break;
    }
}

async function getUsers(req: any, res: any){
    try {
        const result = await prisma.users.findMany()
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json(error)
    }
}

async function addUser(req: any, res: any){
    const {username, email} = req.body

    try {
        const data = {
            username: username,
            email: email
        }
        await prisma.users.create({data: data})
        const result = await prisma.users.findMany()
        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json(error)
        
    }
}
