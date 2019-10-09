import getUserId from '../utils/getUserId'

const Query = {
    users(parent, args, { prisma }, info) {
        const opArgs = {
            first: args.first,
            skip: args.skip,
            after: args.after,
            orderBy: args.orderBy
        } 
        if (args.queryString) {
            opArgs.where = {
                OR: [{
                    name_contains: args.queryString
                }, {
                    email_contains: args.queryString
                }]
            }
        }

        return prisma.query.users(opArgs, info)
    },

    me(parent, args, { prisma, request }, info) {
        const userId = getUserId(request)
        return prisma.query.user({
            where: {
                id: userId,
            }
        })
    }
}

export { Query as default }