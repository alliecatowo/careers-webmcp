
export interface College {
  collegeId: string;
  name: string;
  city: string;
  state: string;
  accreditation: string;
  isActive: boolean;
}

export const mockColleges: College[] = [
  { collegeId: 'col-001', name: 'IIT Delhi', city: 'Delhi', state: 'Delhi', accreditation: 'A+', isActive: true },
  { collegeId: 'col-002', name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', accreditation: 'A+', isActive: true },
  { collegeId: 'col-003', name: 'NIT Trichy', city: 'Trichy', state: 'Tamil Nadu', accreditation: 'A', isActive: true },
  { collegeId: 'col-004', name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', accreditation: 'A+', isActive: false },
  { collegeId: 'col-005', name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', accreditation: 'A', isActive: true },
  // Add more colleges as needed
];
