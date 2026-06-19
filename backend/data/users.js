import bcrypt from 'bcryptjs'

const users = [
  {
    name: 'Admin User',
    email: 'admin@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: true,
    },
    {
    name: 'Bhakti Panchal',
    email: 'bhakti@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    },
    {
    name: 'abc',
    email: 'abc@email.com',
    password: bcrypt.hashSync('123456', 10),
    isAdmin: false,
    }
]

export default users