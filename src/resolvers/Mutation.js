import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import hashPassword from '../utils/hashPassword'
import generateToken from '../utils/generateToken'

const Mutation = {
	async createUser(parent, args, { prisma }, info) {
		const emailTaken = await prisma.exists.User({ email: args.inputData.email })
		if (emailTaken) {
			throw new Error('Email taken');
		}
		const password = await hashPassword(args.inputData.password)
		const user = await prisma.mutation.createUser({ 
			data: {
				...args.inputData,
				password
			} 
		})

		return {
			user,
			token: generateToken(user.id)
		}
	},

	async login(parent, args, { prisma }, info) {
		const user = await prisma.query.user({
			where: {
				email: args.inputData.email
            }
        })

        if (!user) {
            throw new Error('Unable to login')
        }

        const isMatch = await bcrypt.compare(args.inputData.password, user.password)

        if (!isMatch) {
            throw new Error('Unable to login')
        }

        return {
			user,
			token: generateToken(user.id)
        }
	},
	
	async deleteUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		return prisma.mutation.deleteUser({ 
			where: {
				id: userId
			}
		 }, info)
	},

	async updateUser(parent, args, { prisma, request }, info) {
		const userId = getUserId(request)

		if (args.inputData.password) {
			args.inputData.password = await hashPassword(args.inputData.password)
		}

		return prisma.mutation.updateUser({
			where: {
				id: userId
			},
			data: args.inputData
		}, info)
	}
}

export { Mutation as default };
