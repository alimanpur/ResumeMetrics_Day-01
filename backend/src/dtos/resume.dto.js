class ResumeDTO {
  constructor(resume) {
    this.id = resume.id;
    this.userId = resume.userId;
    this.fileName = resume.title;
    this.fileType = resume.fileType;
    this.fileSize = resume.fileSize;
    this.fileUrl = resume.fileUrl;
    this.targetRole = resume.targetRole;
    this.createdAt = resume.createdAt;
    this.updatedAt = resume.updatedAt;
    this.latestScore = resume.latestScore || resume.atsScore || 0;
    this.status = resume.status || 'PENDING';
    this.analysisId = resume.analysisId || null;
  }

  static fromPrisma(resume) {
    if (!resume) return null;
    return new ResumeDTO(resume);
  }

  static fromPrismaArray(resumes) {
    return (resumes || []).map((r) => ResumeDTO.fromPrisma(r));
  }
}

class ResumeDetailDTO {
  constructor(resume) {
    this.id = resume.id;
    this.userId = resume.userId;
    this.fileName = resume.title;
    this.fileType = resume.fileType;
    this.fileSize = resume.fileSize;
    this.fileUrl = resume.fileUrl;
    this.targetRole = resume.targetRole;
    this.createdAt = resume.createdAt;
    this.updatedAt = resume.updatedAt;
    this.latestScore = resume.analyses?.[0]?.atsScore || 0;
    this.status = resume.analyses?.[0]?.status || 'PENDING';
    this.analyses = (resume.analyses || []).map(a => ({
      id: a.id,
      status: a.status,
      atsScore: a.atsScore,
      createdAt: a.createdAt,
    }));
  }

  static fromPrisma(resume) {
    if (!resume) return null;
    return new ResumeDetailDTO(resume);
  }
}

module.exports = { ResumeDTO, ResumeDetailDTO };