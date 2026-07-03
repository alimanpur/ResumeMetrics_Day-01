class ComparisonDTO {
  constructor(comparison) {
    this.id = comparison.id;
    this.userId = comparison.userId;
    this.resumeId = comparison.resumeId;
    this.analysisId = comparison.analysisId;
    this.jobDescriptionId = comparison.targetRole;
    this.matchScore = comparison.atsScore;
    this.missingSkills = comparison.missingSkills;
    this.recommendations = comparison.suggestionsData;
    this.summary = comparison.summary;
    this.createdAt = comparison.createdAt;
    this.resume = comparison.resume ? {
      id: comparison.resume.id,
      title: comparison.resume.title,
      fileUrl: comparison.resume.fileUrl,
    } : undefined;
  }

  static fromPrisma(comparison) {
    if (!comparison) return null;
    return new ComparisonDTO(comparison);
  }

  static fromPrismaArray(comparisons) {
    return (comparisons || []).map((c) => ComparisonDTO.fromPrisma(c));
  }
}

class ComparisonListDTO {
  constructor(comparison) {
    this.id = comparison.id;
    this.matchScore = comparison.atsScore;
    this.createdAt = comparison.createdAt;
    this.resume = comparison.resume ? {
      id: comparison.resume.id,
      title: comparison.resume.title,
    } : undefined;
    this.jobDescription = comparison.targetRole ? {
      title: comparison.targetRole,
    } : undefined;
  }

  static fromPrisma(comparison) {
    if (!comparison) return null;
    return new ComparisonListDTO(comparison);
  }

  static fromPrismaArray(comparisons) {
    return (comparisons || []).map((c) => ComparisonListDTO.fromPrisma(c));
  }
}

module.exports = { ComparisonDTO, ComparisonListDTO };