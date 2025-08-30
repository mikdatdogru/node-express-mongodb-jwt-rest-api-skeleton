/* eslint handle-callback-err: "off"*/

process.env.NODE_ENV = 'test'

const request = require('supertest')
const { expect } = require('chai')
const server = require('../server')
const loginDetails = {
  email: 'admin@admin.com',
  password: '12345'
}
let token = ''

describe('*********** PROFILE ***********', () => {
  describe('/POST login', () => {
    it('should GET token', async () => {
      const response = await request(server)
        .post('/login')
        .send(loginDetails)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('token')
      token = response.body.token
    })
  })
  describe('/GET profile', () => {
    it('should NOT be able to consume the route since no token was sent', async () => {
      await request(server).get('/profile').expect(401)
    })
    it('should GET profile', async () => {
      const response = await request(server)
        .get('/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.include.keys('name', 'email')
    })
  })
  describe('/PATCH profile', () => {
    it('should NOT UPDATE profile empty name/email', async () => {
      const user = {}
      const response = await request(server)
        .patch('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should UPDATE profile', async () => {
      const user = {
        name: 'Test123456',
        urlTwitter: 'https://hello.com',
        urlGitHub: 'https://hello.io',
        phone: '123123123',
        city: 'Bucaramanga',
        country: 'Colombia'
      }
      const response = await request(server)
        .patch('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('name', 'Test123456')
      expect(response.body).to.have.property('urlTwitter', 'https://hello.com')
      expect(response.body).to.have.property('urlGitHub', 'https://hello.io')
      expect(response.body).to.have.property('phone', '123123123')
      expect(response.body).to.have.property('city', 'Bucaramanga')
      expect(response.body).to.have.property('country', 'Colombia')
    })
    it('should NOT UPDATE profile with email that already exists', async () => {
      const user = {
        email: 'programmer@programmer.com'
      }
      const response = await request(server)
        .patch('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should NOT UPDATE profile with not valid URLs', async () => {
      const user = {
        name: 'Test123456',
        urlTwitter: 'hello',
        urlGitHub: 'hello',
        phone: '123123123',
        city: 'Bucaramanga',
        country: 'Colombia'
      }
      const response = await request(server)
        .patch('/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(user)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
  })
  describe('/POST profile/changePassword', () => {
    it('should NOT change password', async () => {
      const data = {
        oldPassword: '123456',
        newPassword: '123456'
      }
      const response = await request(server)
        .post('/profile/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(409)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body)
        .to.have.property('errors')
        .that.has.property('msg', 'WRONG_PASSWORD')
    })
    it('should NOT change a too short password', async () => {
      const data = {
        oldPassword: '1234',
        newPassword: '1234'
      }
      const response = await request(server)
        .post('/profile/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(422)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('errors')
    })
    it('should change password', async () => {
      const data = {
        oldPassword: '12345',
        newPassword: '12345'
      }
      const response = await request(server)
        .post('/profile/changePassword')
        .set('Authorization', `Bearer ${token}`)
        .send(data)
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).to.be.an('object')
      expect(response.body).to.have.property('msg', 'PASSWORD_CHANGED')
    })
  })
})
