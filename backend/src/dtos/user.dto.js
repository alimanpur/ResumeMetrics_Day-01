class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.isEmailVerified = user.isEmailVerified;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromPrisma(user) {
    if (!user) return null;
    return new UserDTO(user);
  }

  static fromPrismaArray(users) {
    return users.map((user) => UserDTO.fromPrisma(user));
  }
}

class AuthDTO {
  constructor(user, accessToken, refreshToken) {
    this.user = UserDTO.fromPrisma(user);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  static fromAuth(user, accessToken, refreshToken) {
    return new AuthDTO(user, accessToken, refreshToken);
  }
}

class ProfileDTO {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.isEmailVerified = user.isEmailVerified;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.subscription = user.subscriptions || { tier: 'FREE', status: 'active' };
  }

  static fromPrisma(user) {
    if (!user) return null;
    return new ProfileDTO(user);
  }
}

module.exports = { UserDTO, AuthDTO, ProfileDTO };