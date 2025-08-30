/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const User = require('../app/models/user')
const { faker } = require('@faker-js/faker')
const request = require('supertest')
const { expect } = require('chai')
const server = require('../server')
const loginDetails = {
  admin: {
    id: '5aa1c2c35ef7a4e97b5e995a',
    email: 'admin@admin.com',
    password: '12345'
  },
  user: {
    id: '5aa1c2c35ef7a4e97b5e995b',
    email: 'user@user.com',
    password: '12345'
  }
}
const tokens = {
  admin: '',
  user: ''
}

const email = faker.internet.email()
const createdID = []

describe('*********** USERS ***********', () => {
  describe('/POST login', () => {
    it('should GET token as admin', async () => {
      const response = await request(server)
        .post('/login')
        .send(loginDetails.admin)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
      tokens.admin = response.body.token
    })
    it('should GET token as user', async () => {
      const response = await request(server)
        .post('/login')
        .send(loginDetails.user)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
      tokens.user = response.body.token
    })
  })
  describe('/GET users', () => {
    it('should NOT be able to consume the route since no token was sent', async () => {
      await request(server).get('/users').expect(401)
    })
    it('should GET all the users', async () => {
      const response = await request(server)
        .get('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body.docs).to.be.an('array')
    })
    it('should GET the users with filters', async () => {
      const response = await request(server)
        .get('/users?filter=admin&fields=name,email,city,country,phone')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body.docs).to.be.an('array')
      expect(response.body.docs).to.have.lengthOf(1)
      expect(response.body.docs[0]).to.have.property('email', 'admin@admin.com')
    })
  })
  describe('/POST user', () => {
    it('should NOT POST a user without name', async () => {
      const user = {}
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should POST a user', async () => {
      const user = {
        name: faker.lorem.words(),
        email,
        password: faker.lorem.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.number(),
        city: faker.lorem.words(),
        country: faker.lorem.words()
      }
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys(
        '_id',
        'name',
        'email',
        'verification'
      )
      createdID.push(response.body._id)
    })
    it('should NOT POST a user with email that already exists', async () => {
      const user = {
        name: faker.lorem.words(),
        email,
        password: faker.lorem.words(),
        role: 'admin'
      }
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should NOT POST a user with not known role', async () => {
      const user = {
        name: faker.lorem.words(),
        email,
        password: faker.lorem.words(),
        role: faker.lorem.words()
      }
      const response = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
  })
  describe('/GET/:id user', () => {
    it('should GET a user by the given id', async () => {
      const id = createdID.slice(-1).pop()
      const response = await request(server)
        .get(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('name')
      expect(response.body).to.have.property('_id', id)
    })
  })
  describe('/PATCH/:id user', () => {
    it('should UPDATE a user given the id', async () => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: 'JS123456',
        email: 'emailthatalreadyexists@email.com',
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.number(),
        city: faker.lorem.words(),
        country: faker.lorem.words()
      }
      const response = await request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('_id', id)
      expect(response.body).to.have.property('name', 'JS123456')
      expect(response.body).to.have.property(
        'email',
        'emailthatalreadyexists@email.com'
      )
      createdID.push(response.body._id)
    })
    it('should NOT UPDATE a user with email that already exists', async () => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.lorem.words(),
        email: 'admin@admin.com',
        role: 'admin'
      }
      const response = await request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should NOT UPDATE another user if not an admin', async () => {
      const id = createdID.slice(-1).pop()
      const user = {
        name: faker.lorem.words(),
        email: 'toto@toto.com',
        role: 'user'
      }
      const response = await request(server)
        .patch(`/users/${id}`)
        .set('Authorization', `Bearer ${tokens.user}`)
        .send(user)
        .expect(401)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
  })
  describe('/DELETE/:id user', () => {
    it('should DELETE a user given the id', async () => {
      const user = {
        name: faker.lorem.words(),
        email: faker.internet.email(),
        password: faker.lorem.words(),
        role: 'admin',
        urlTwitter: faker.internet.url(),
        urlGitHub: faker.internet.url(),
        phone: faker.phone.number(),
        city: faker.lorem.words(),
        country: faker.lorem.words()
      }
      // First create a user
      const createResponse = await request(server)
        .post('/users')
        .set('Authorization', `Bearer ${tokens.admin}`)
        .send(user)
        .expect(201)
        .expect('Content-Type', /json/)

      expect(createResponse.body).to.be.an('object')
      expect(createResponse.body).to.include.keys(
        '_id',
        'name',
        'email',
        'verification'
      )

      // Then delete it
      const deleteResponse = await request(server)
        .delete(`/users/${createResponse.body._id}`)
        .set('Authorization', `Bearer ${tokens.admin}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(deleteResponse.body).to.be.an('object')
      expect(deleteResponse.body).to.have.property('msg', 'DELETED')
    })
  })

  after(async () => {
    for (const id of createdID) {
      try {
        await User.findByIdAndDelete(id)
      } catch (err) {
        console.log(err)
      }
    }
  })
})
