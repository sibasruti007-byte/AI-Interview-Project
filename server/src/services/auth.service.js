const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/env');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');
const AppError = require('../utils/appError');

class AuthService {
  generateTokens(user) {
    const accessToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRES }
    );

    const refreshTokenRaw = crypto.randomBytes(40).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    return {
      accessToken,
      refreshTokenRaw,
      refreshExpiresAt
    };
  }

  async saveRefreshToken(userId, tokenString, expiresAt, ipAddress) {
    const hashed = crypto.createHash('sha256').update(tokenString).digest('hex');
    await RefreshToken.create({
      user: userId,
      token: hashed,
      expiresAt,
      createdByIp: ipAddress
    });
  }

  async rotateRefreshToken(rawToken, ipAddress) {
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    const tokenDoc = await RefreshToken.findOne({ token: hashed });

    if (!tokenDoc) {
      throw new AppError('Invalid refresh token.', 401);
    }

    if (tokenDoc.isRevoked) {
      // Possible token theft! Revoke all tokens for this user
      await RefreshToken.updateMany({ user: tokenDoc.user }, { isRevoked: true });
      throw new AppError('Compromised session detected. Please log in again.', 401);
    }

    if (tokenDoc.expiresAt < new Date()) {
      tokenDoc.isRevoked = true;
      await tokenDoc.save();
      throw new AppError('Refresh token expired. Please log in again.', 401);
    }

    const user = await User.findById(tokenDoc.user);
    if (!user || !user.isActive) {
      throw new AppError('User no longer active.', 401);
    }

    // Revoke old token
    tokenDoc.isRevoked = true;
    const { accessToken, refreshTokenRaw, refreshExpiresAt } = this.generateTokens(user);
    tokenDoc.replacedByToken = crypto.createHash('sha256').update(refreshTokenRaw).digest('hex');
    await tokenDoc.save();

    // Save new token
    await this.saveRefreshToken(user._id, refreshTokenRaw, refreshExpiresAt, ipAddress);

    return {
      user,
      accessToken,
      refreshToken: refreshTokenRaw
    };
  }

  async revokeToken(rawToken) {
    if (!rawToken) return;
    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    await RefreshToken.updateOne({ token: hashed }, { isRevoked: true });
  }

  generatePasswordResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    return {
      resetToken,
      hashedToken,
      expiresAt
    };
  }
}

module.exports = new AuthService();
