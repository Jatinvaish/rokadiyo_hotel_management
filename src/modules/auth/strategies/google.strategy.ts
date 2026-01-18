import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private config: ConfigService) {
    const clientID = config.get('GOOGLE_CLIENT_ID');
    const clientSecret = config.get('GOOGLE_CLIENT_SECRET');
    
    // Only initialize if Google OAuth credentials are provided
    if (!clientID || !clientSecret) {
      // Skip initialization - OAuth not configured
      super({
        clientID: 'dummy',
        clientSecret: 'dummy',
        callbackURL: 'http://localhost:3060/api/auth/google/callback',
        scope: ['email', 'profile'],
      });
      return;
    }

    super({
      clientID,
      clientSecret,
      callbackURL: config.get('GOOGLE_CALLBACK_URL') || 'http://localhost:3060/api/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    return {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      picture: profile.photos[0].value,
    };
  }
}