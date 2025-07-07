import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

export const checkHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    res.status(200).json({message: 'Successful check'});
}

export const loginHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  (async () => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      const user = await AuthService.validateCredentials(email, password);

      if (!user.passwordHash) {
        return res.status(400).json({ error: 'User has no password set' });
      }

      const roles = await AuthService.getUserRoles(user.id);

      const payload = {
        userId: user.id,
        tenantId: user.tenantId,
        roles
      };

      const token = AuthService.generateToken(payload);

      await AuthService.logSession({
        userId: user.id,
        tenantId: user.tenantId,
        token,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'] || ''
      });

      res.json({
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roles
        }
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message || 'Unauthorized' });
    }
  })().catch(next); // Ensure internal errors pass to Express
};

export const meHandler = (req: Request, res: Response): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ error: 'Unauthorized' });
    return; // ✅ prevent further execution
  }

  res.json({ user });
};
