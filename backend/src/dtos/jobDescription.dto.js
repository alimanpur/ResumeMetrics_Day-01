class JobDescriptionDTO {
  constructor(jd) {
    this.id = jd.id;
    this.userId = jd.userId;
    this.title = jd.title || 'Untitled';
    this.company = jd.company || '';
    this.content = jd.content || '';
    this.skills = jd.skills;
    this.createdAt = jd.createdAt;
    this.updatedAt = jd.updatedAt;
  }

  static fromPrisma(jd) {
    if (!jd) return null;
    return new JobDescriptionDTO(jd);
  }

  static fromPrismaArray(jds) {
    return (jds || []).map((j) => JobDescriptionDTO.fromPrisma(j));
  }
}

module.exports = { JobDescriptionDTO };