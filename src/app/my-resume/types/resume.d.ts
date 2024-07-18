import { WritableDraft } from "immer";



// Resume Headline
 interface HeadlineData {
  description: string;
}

export interface HeadlineDataResponse {
  code: number;
  success: boolean;
  message: string;
  data: HeadlineData[];
}

// Resume Key Skill

interface KeySkillData {
title :string
}
interface KeySkillDataResponse {
  code: number;
  success: boolean;
  message: string;
  data: KeySkillData[];

}


//my-resume

export interface ResumeFetchResponse {
  code: number;
  success: boolean;
  message: string;
  data: ResumeData[];
}

export interface ResumeData {
  id: number;
  headline_id: number | null;
  created_at: string;
  updated_at: string;
  key_skill_id: number | null;
  employment_id: number | null;
  education_id: number | null;
  it_skill_id: number | null;
  project_id: number | null;
  user_id: number;
  profile_summary_id: number | null;
  headlines: Headline[];
  key_skills: any[]; // Adjust the type as needed
  employments: any[]; // Adjust the type as needed
  educations: any[]; // Adjust the type as needed
  it_skills: any[]; // Adjust the type as needed
  projects: any[]; // Adjust the type as needed
  profile_summaries: any[]; // Adjust the type as needed
  accomplishments: any[]; // Adjust the type as needed
  career_profiles: any[]; // Adjust the type as needed
  personal_details: any[]; // Adjust the type as needed
  files: any[]; // Adjust the type as needed
}

export interface Headline {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
  pivot: {
    resume_id: number;
    headline_id: number;
  };
}


type WritableResumeFetchResponse = WritableDraft<ResumeFetchResponse>;
type WritableHeadlineData = WritableDraft<HeadlineData>;
type WritableHeadlineDataResponse = WritableDraft<HeadlineDataResponse>;
type WritableKeySkillData = WritableDraft<KeySkillData>;
type WritableKeySkillDataResponse = WritableDraft<KeySkillDataResponse>;


export {
  WritableResumeFetchResponse,
  WritableHeadlineData,
  WritableHeadlineDataResponse, 
  WritableKeySkillData,
  WritableKeySkillDataResponse
}