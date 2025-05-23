import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth } from '@/lib/auth';
import { User } from '@prisma/client';

export default withAuth(async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  // Only allow GET method
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Return user data (user is already verified by withAuth middleware)
    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
