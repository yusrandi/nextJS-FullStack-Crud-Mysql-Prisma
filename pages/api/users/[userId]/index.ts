import {prisma} from '../../../../config/db'

export default async function handler(req: any, res: any) {
    // res.status(200).setHeader('Access-Control-Allow-Origin', '*').json({ name: 'this is users api route' });

    switch (req.method) {
        case 'GET':
        return await getUser(req, res)
            break;
            
        case 'PUT':
                return await updateUser(req, res)
                break;

        case 'DELETE':
            return await deleteUser(req, res)
            break;

      
    
        default:
            break;
    }
}

async function getUser(req: any, res: any){
    const {userId} = req.query
    // return res.status(200).json(userId)


    try {
        const result = await prisma.users.findFirst({
            where: {
                id: {
                    equals: parseInt(userId)
                }
            }
        })
        return res.status(200).json(result)
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(error)
    }
}
async function updateUser(req: any, res: any){
    const {username, email} = req.body
    const {userId} = req.query

    try {
        const data = {
            username: username,
            email: email
        }
        await prisma.users.update({
            where: {
                id: parseInt(userId)
            },
            data: data
        
        })
        const result = await prisma.users.findMany()

        return res.status(200).json(result)

    } catch (error) {
        return res.status(500).json(error)
        
    }
}
async function deleteUser(req: any, res: any){
    const {userId} = req.query
    // return res.status(200).json(userId)
    try {
        await prisma.users.delete({
            where: {
                id: parseInt(userId)
            }
        })
        const result = await prisma.users.findMany()
        return res.status(200).json(result)
    } catch (error) {
        console.log(error);
        
        return res.status(500).json(error)
    }
}
