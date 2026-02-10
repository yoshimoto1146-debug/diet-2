
export enum DietGoal {
  GENERAL = '一般ダイエット',
  POSTPARTUM = '産後ダイエット',
  DIABETES = '生活習慣病予防',
  MAINTENANCE = '健康維持・姿勢改善',
  POSTPARTUM_NURSING = '産後ダイエット（授乳中）',
  OTHER = 'その他'
}

export enum Gender {
  MALE = '男性',
  FEMALE = '女性'
}

export enum JobActivity {
  SEDENTARY = '座り仕事中心',
  WALK = '歩くことが多い',
  HEAVY = '力仕事中心'
}

export type MealCategory = '朝食' | '昼食' | '夕食' | '間食';

export interface NutritionTargets {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface UserProfile {
  patientId: string;
  name: string;
  goal: DietGoal;
  gender?: Gender;
  age?: number;
  heightCm?: number;
  targetWeightKg?: number;
  jobActivity?: JobActivity;
  customTargets?: NutritionTargets;
}

export interface InBodyData {
  id: string;
  date: string;
  weightKg: number;
  muscleMassKg?: number;
  bodyFatMassKg?: number;
  visceralFatLevel?: number;
  bodyFatPercent?: number;
  score?: number;
  isManual?: boolean;
}

export interface MealLog {
  id: string;
  date: string;
  category: MealCategory;
  description: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  aiAnalysis?: string;
  time?: string;
  imageUrl?: string;
}

export type ViewState = 'login' | 'dashboard' | 'inbody' | 'meals' | 'profile' | 'staff-portal';
