import jwt from 'jsonwebtoken';

class AuthController {
  public isValidJwt(token: string) {
    try {
      const valid = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.log(err);
    }
  }
}

export default new AuthController();
