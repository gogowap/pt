export interface NavItem {
  label: string;
  href: string;
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  iconName: 'Server' | 'Layers' | 'Workflow' | 'ShieldCheck';
  deliverables: string[];
  operationalScope: string;
}

export type ProjectCategory = 'all' | 'infrastruktur' | 'sistem' | 'alur_kerja';

export interface ProjectItem {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  clientType: string;
  summary: string;
  detailedCase: string;
  keyMetric: string;
  keyMetricLabel: string;
  scopeList: string[];
  isDummyNotice: string;
}

export interface CompanyMetric {
  value: string;
  label: string;
  context: string;
}

export interface ContactFormData {
  fullName: string;
  workEmail: string;
  organization: string;
  serviceCategory: string;
  message: string;
  urgency: 'standar' | 'prioritas';
}
