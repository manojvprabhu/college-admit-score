import React, { useState, useMemo } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { AlertCircle, TrendingUp, Target, BookOpen, Award, Users, Search, MapPin, GraduationCap, Filter } from 'lucide-react';

const AdmitScoreApp = () => {
  const [currentStep, setCurrentStep] = useState('input');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tier: 'all',
    region: 'all',
    type: 'all'
  });
  const [studentData, setStudentData] = useState({
    gpa: '',
    satScore: '',
    actScore: '',
    apCourses: '',
    leadership: '',
    communityService: '',
    athletics: '',
    researchProjects: '',
    internships: '',
    awards: '',
    familyIncome: '',
    firstGen: false,
    underrepresented: false,
    intendedMajor: '',
    state: '',
    university: ''
  });
  const [results, setResults] = useState(null);

  const universities = [
    // Elite Tier - Ivy League
    { name: 'Harvard University', tier: 'Elite', avgGPA: 4.18, avgSAT: 1520, avgACT: 34, acceptanceRate: 3.2, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Yale University', tier: 'Elite', avgGPA: 4.14, avgSAT: 1515, avgACT: 34, acceptanceRate: 4.5, region: 'Northeast', type: 'Private', state: 'CT' },
    { name: 'Princeton University', tier: 'Elite', avgGPA: 3.95, avgSAT: 1510, avgACT: 34, acceptanceRate: 4.0, region: 'Northeast', type: 'Private', state: 'NJ' },
    { name: 'Columbia University', tier: 'Elite', avgGPA: 4.15, avgSAT: 1505, avgACT: 34, acceptanceRate: 3.7, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'University of Pennsylvania', tier: 'Elite', avgGPA: 3.90, avgSAT: 1500, avgACT: 34, acceptanceRate: 5.9, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Brown University', tier: 'Elite', avgGPA: 4.08, avgSAT: 1495, avgACT: 34, acceptanceRate: 5.1, region: 'Northeast', type: 'Private', state: 'RI' },
    { name: 'Dartmouth College', tier: 'Elite', avgGPA: 4.11, avgSAT: 1490, avgACT: 34, acceptanceRate: 6.2, region: 'Northeast', type: 'Private', state: 'NH' },
    { name: 'Cornell University', tier: 'Elite', avgGPA: 4.07, avgSAT: 1480, avgACT: 33, acceptanceRate: 7.3, region: 'Northeast', type: 'Private', state: 'NY' },

    // Elite Tier - Top Private Universities
    { name: 'Stanford University', tier: 'Elite', avgGPA: 4.18, avgSAT: 1520, avgACT: 34, acceptanceRate: 3.7, region: 'West', type: 'Private', state: 'CA' },
    { name: 'Massachusetts Institute of Technology', tier: 'Elite', avgGPA: 4.17, avgSAT: 1535, avgACT: 35, acceptanceRate: 3.9, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'California Institute of Technology', tier: 'Elite', avgGPA: 4.19, avgSAT: 1545, avgACT: 35, acceptanceRate: 3.0, region: 'West', type: 'Private', state: 'CA' },
    { name: 'Duke University', tier: 'Elite', avgGPA: 4.13, avgSAT: 1510, avgACT: 34, acceptanceRate: 6.2, region: 'South', type: 'Private', state: 'NC' },
    { name: 'University of Chicago', tier: 'Elite', avgGPA: 4.11, avgSAT: 1520, avgACT: 34, acceptanceRate: 5.4, region: 'Midwest', type: 'Private', state: 'IL' },
    { name: 'Northwestern University', tier: 'Elite', avgGPA: 4.10, avgSAT: 1490, avgACT: 34, acceptanceRate: 7.0, region: 'Midwest', type: 'Private', state: 'IL' },
    { name: 'Johns Hopkins University', tier: 'Elite', avgGPA: 3.93, avgSAT: 1520, avgACT: 34, acceptanceRate: 7.5, region: 'South', type: 'Private', state: 'MD' },
    { name: 'Vanderbilt University', tier: 'Elite', avgGPA: 3.91, avgSAT: 1490, avgACT: 34, acceptanceRate: 6.7, region: 'South', type: 'Private', state: 'TN' },
    { name: 'Rice University', tier: 'Elite', avgGPA: 4.12, avgSAT: 1515, avgACT: 35, acceptanceRate: 8.7, region: 'South', type: 'Private', state: 'TX' },
    { name: 'Washington University in St. Louis', tier: 'Elite', avgGPA: 4.15, avgSAT: 1500, avgACT: 34, acceptanceRate: 11.9, region: 'Midwest', type: 'Private', state: 'MO' },
    { name: 'Emory University', tier: 'Elite', avgGPA: 3.90, avgSAT: 1460, avgACT: 33, acceptanceRate: 11.4, region: 'South', type: 'Private', state: 'GA' },
    { name: 'Georgetown University', tier: 'Highly Selective', avgGPA: 4.01, avgSAT: 1450, avgACT: 33, acceptanceRate: 12.0, region: 'South', type: 'Private', state: 'DC' },
    { name: 'Carnegie Mellon University', tier: 'Elite', avgGPA: 3.91, avgSAT: 1500, avgACT: 34, acceptanceRate: 11.3, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'University of Notre Dame', tier: 'Elite', avgGPA: 4.06, avgSAT: 1475, avgACT: 34, acceptanceRate: 12.9, region: 'Midwest', type: 'Private', state: 'IN' },
    
    // Highly Selective Tier - Private Universities
    { name: 'Georgetown University', tier: 'Highly Selective', avgGPA: 4.01, avgSAT: 1450, avgACT: 33, acceptanceRate: 12.0, region: 'South', type: 'Private', state: 'DC' },
    { name: 'University of Southern California', tier: 'Highly Selective', avgGPA: 3.88, avgSAT: 1440, avgACT: 33, acceptanceRate: 12.4, region: 'West', type: 'Private', state: 'CA' },
    { name: 'Tufts University', tier: 'Highly Selective', avgGPA: 4.04, avgSAT: 1465, avgACT: 33, acceptanceRate: 9.7, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'New York University', tier: 'Highly Selective', avgGPA: 3.71, avgSAT: 1440, avgACT: 32, acceptanceRate: 12.2, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Boston College', tier: 'Highly Selective', avgGPA: 3.96, avgSAT: 1420, avgACT: 33, acceptanceRate: 16.7, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Boston University', tier: 'Highly Selective', avgGPA: 3.88, avgSAT: 1410, avgACT: 32, acceptanceRate: 18.3, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Northeastern University', tier: 'Highly Selective', avgGPA: 4.04, avgSAT: 1430, avgACT: 33, acceptanceRate: 6.7, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Wake Forest University', tier: 'Highly Selective', avgGPA: 3.92, avgSAT: 1380, avgACT: 31, acceptanceRate: 21.3, region: 'South', type: 'Private', state: 'NC' },
    { name: 'Tulane University', tier: 'Highly Selective', avgGPA: 3.56, avgSAT: 1390, avgACT: 31, acceptanceRate: 11.1, region: 'South', type: 'Private', state: 'LA' },
    { name: 'University of Miami', tier: 'Highly Selective', avgGPA: 3.70, avgSAT: 1340, avgACT: 31, acceptanceRate: 19.0, region: 'South', type: 'Private', state: 'FL' },
    { name: 'University of Rochester', tier: 'Highly Selective', avgGPA: 3.80, avgSAT: 1420, avgACT: 32, acceptanceRate: 39.3, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Rensselaer Polytechnic Institute', tier: 'Highly Selective', avgGPA: 3.91, avgSAT: 1410, avgACT: 32, acceptanceRate: 42.8, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Case Western Reserve University', tier: 'Highly Selective', avgGPA: 3.84, avgSAT: 1420, avgACT: 32, acceptanceRate: 27.7, region: 'Midwest', type: 'Private', state: 'OH' },
    { name: 'Lehigh University', tier: 'Highly Selective', avgGPA: 3.86, avgSAT: 1360, avgACT: 31, acceptanceRate: 36.7, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Brandeis University', tier: 'Highly Selective', avgGPA: 3.93, avgSAT: 1410, avgACT: 32, acceptanceRate: 39.0, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'George Washington University', tier: 'Highly Selective', avgGPA: 3.86, avgSAT: 1340, avgACT: 31, acceptanceRate: 49.0, region: 'Northeast', type: 'Private', state: 'DC' },

    // Selective Tier - Private Universities
    { name: 'George Washington University', tier: 'Selective', avgGPA: 3.86, avgSAT: 1350, avgACT: 31, acceptanceRate: 42.6, region: 'South', type: 'Private', state: 'DC' },
    { name: 'Syracuse University', tier: 'Selective', avgGPA: 3.67, avgSAT: 1270, avgACT: 28, acceptanceRate: 51.8, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Villanova University', tier: 'Selective', avgGPA: 4.23, avgSAT: 1380, avgACT: 32, acceptanceRate: 23.0, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Lehigh University', tier: 'Selective', avgGPA: 3.90, avgSAT: 1355, avgACT: 31, acceptanceRate: 37.2, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Case Western Reserve University', tier: 'Selective', avgGPA: 3.85, avgSAT: 1420, avgACT: 33, acceptanceRate: 27.7, region: 'Midwest', type: 'Private', state: 'OH' },
    { name: 'Wake Forest University', tier: 'Selective', avgGPA: 3.99, avgSAT: 1370, avgACT: 31, acceptanceRate: 21.4, region: 'South', type: 'Private', state: 'NC' },
    { name: 'Syracuse University', tier: 'Selective', avgGPA: 3.67, avgSAT: 1260, avgACT: 28, acceptanceRate: 51.8, region: 'Northeast', type: 'Private', state: 'NY' },

    // Elite Tier - Top Public Universities
    { name: 'University of California-Berkeley', tier: 'Elite', avgGPA: 3.90, avgSAT: 1430, avgACT: 33, acceptanceRate: 11.4, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of California-Los Angeles', tier: 'Elite', avgGPA: 4.18, avgSAT: 1410, avgACT: 32, acceptanceRate: 8.8, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of Michigan-Ann Arbor', tier: 'Elite', avgGPA: 3.90, avgSAT: 1435, avgACT: 33, acceptanceRate: 17.7, region: 'Midwest', type: 'Public', state: 'MI' },
    { name: 'University of Virginia', tier: 'Elite', avgGPA: 4.32, avgSAT: 1430, avgACT: 33, acceptanceRate: 19.0, region: 'South', type: 'Public', state: 'VA' },
    { name: 'University of North Carolina at Chapel Hill', tier: 'Highly Selective', avgGPA: 4.39, avgSAT: 1390, avgACT: 31, acceptanceRate: 16.8, region: 'South', type: 'Public', state: 'NC' },
    { name: 'Georgia Institute of Technology', tier: 'Elite', avgGPA: 4.07, avgSAT: 1440, avgACT: 33, acceptanceRate: 16.0, region: 'South', type: 'Public', state: 'GA' },

    // Highly Selective Tier - Top Public Universities
    { name: 'University of California-San Diego', tier: 'Highly Selective', avgGPA: 4.08, avgSAT: 1380, avgACT: 31, acceptanceRate: 23.8, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of California-Davis', tier: 'Highly Selective', avgGPA: 4.03, avgSAT: 1330, avgACT: 30, acceptanceRate: 37.3, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of California-Irvine', tier: 'Highly Selective', avgGPA: 4.00, avgSAT: 1350, avgACT: 30, acceptanceRate: 21.3, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of California-Santa Barbara', tier: 'Highly Selective', avgGPA: 4.08, avgSAT: 1360, avgACT: 31, acceptanceRate: 25.9, region: 'West', type: 'Public', state: 'CA' },
    { name: 'University of Wisconsin-Madison', tier: 'Highly Selective', avgGPA: 3.88, avgSAT: 1380, avgACT: 30, acceptanceRate: 49.1, region: 'Midwest', type: 'Public', state: 'WI' },
    { name: 'University of Illinois at Urbana-Champaign', tier: 'Highly Selective', avgGPA: 3.85, avgSAT: 1380, avgACT: 31, acceptanceRate: 44.8, region: 'Midwest', type: 'Public', state: 'IL' },
    { name: 'University of Texas at Austin', tier: 'Highly Selective', avgGPA: 3.84, avgSAT: 1355, avgACT: 31, acceptanceRate: 29.3, region: 'South', type: 'Public', state: 'TX' },
    { name: 'University of Washington-Seattle', tier: 'Highly Selective', avgGPA: 3.80, avgSAT: 1340, avgACT: 30, acceptanceRate: 47.5, region: 'West', type: 'Public', state: 'WA' },
    { name: 'University of Florida', tier: 'Highly Selective', avgGPA: 4.05, avgSAT: 1360, avgACT: 31, acceptanceRate: 22.9, region: 'South', type: 'Public', state: 'FL' },
    { name: 'College of William & Mary', tier: 'Highly Selective', avgGPA: 4.27, avgSAT: 1410, avgACT: 32, acceptanceRate: 33.5, region: 'South', type: 'Public', state: 'VA' },
        
    // Selective Tier - Top Public Universities
    { name: 'Ohio State University', tier: 'Selective', avgGPA: 3.83, avgSAT: 1320, avgACT: 29, acceptanceRate: 52.7, region: 'Midwest', type: 'Public', state: 'OH' },
    { name: 'Pennsylvania State University-University Park', tier: 'Selective', avgGPA: 3.68, avgSAT: 1270, avgACT: 28, acceptanceRate: 49.1, region: 'Northeast', type: 'Public', state: 'PA' },
    { name: 'Purdue University-Main Campus', tier: 'Selective', avgGPA: 3.74, avgSAT: 1290, avgACT: 29, acceptanceRate: 52.7, region: 'Midwest', type: 'Public', state: 'IN' },
    { name: 'University of Maryland-College Park', tier: 'Selective', avgGPA: 4.32, avgSAT: 1360, avgACT: 31, acceptanceRate: 44.5, region: 'South', type: 'Public', state: 'MD' },
    { name: 'University of Georgia', tier: 'Selective', avgGPA: 4.07, avgSAT: 1310, avgACT: 30, acceptanceRate: 42.5, region: 'South', type: 'Public', state: 'GA' },
    { name: 'Texas A&M University-College Station', tier: 'Selective', avgGPA: 3.69, avgSAT: 1240, avgACT: 27, acceptanceRate: 63.0, region: 'South', type: 'Public', state: 'TX' },
    { name: 'University of Minnesota-Twin Cities', tier: 'Selective', avgGPA: 3.80, avgSAT:1340, avgACT: 29, acceptanceRate: 74.8, region: 'Midwest', type: 'Public', state: 'MN' },
    { name: 'Rutgers University-New Brunswick', tier: 'Selective', avgGPA: 3.73, avgSAT: 1310, avgACT: 29, acceptanceRate: 66.3, region: 'Northeast', type: 'Public', state: 'NJ' },
    { name: 'Virginia Tech', tier: 'Selective', avgGPA: 4.04, avgSAT: 1290, avgACT: 29, acceptanceRate: 56.6, region: 'South', type: 'Public', state: 'VA' },
    { name: 'University of Pittsburgh-Pittsburgh Campus', tier: 'Selective', avgGPA: 4.07, avgSAT: 1330, avgACT: 30, acceptanceRate: 49.0, region: 'Northeast', type: 'Public', state: 'PA' },
    { name: 'Michigan State University', tier: 'Selective', avgGPA: 3.68, avgSAT: 1190, avgACT: 25, acceptanceRate: 88.0, region: 'Midwest', type: 'Public', state: 'MI' },
    { name: 'Indiana University-Bloomington', tier: 'Selective', avgGPA: 3.80, avgSAT: 1250, avgACT: 28, acceptanceRate: 82.0, region: 'Midwest', type: 'Public', state: 'IN' },
    { name: 'University of Iowa', tier: 'Selective', avgGPA: 3.72, avgSAT: 1210, avgACT: 26, acceptanceRate: 86.0, region: 'Midwest', type: 'Public', state: 'IA' },
    { name: 'Iowa State University', tier: 'Selective', avgGPA: 3.65, avgSAT: 1205, avgACT: 26, acceptanceRate: 90.0, region: 'Midwest', type: 'Public', state: 'IA' },
    { name: 'University of Colorado Boulder', tier: 'Selective', avgGPA: 3.66, avgSAT: 1270, avgACT: 28, acceptanceRate: 80.7, region: 'West', type: 'Public', state: 'CO' },
    { name: 'University of Arizona', tier: 'Selective', avgGPA: 3.43, avgSAT: 1180, avgACT: 24, acceptanceRate: 87.2, region: 'West', type: 'Public', state: 'AZ' },
    { name: 'Arizona State University', tier: 'Selective', avgGPA: 3.54, avgSAT: 1190, avgACT: 24, acceptanceRate: 90.0, region: 'West', type: 'Public', state: 'AZ' },
    { name: 'University of Oregon', tier: 'Selective', avgGPA: 3.59, avgSAT: 1190, avgACT: 26, acceptanceRate: 86.3, region: 'West', type: 'Public', state: 'OR' },
    { name: 'Oregon State University', tier: 'Selective', avgGPA: 3.59, avgSAT: 1160, avgACT: 24, acceptanceRate: 82.7, region: 'West', type: 'Public', state: 'OR' },
    { name: 'University of South Carolina-Columbia', tier: 'Selective', avgGPA: 4.15, avgSAT: 1240, avgACT: 27, acceptanceRate: 64.0, region: 'South', type: 'Public', state: 'SC' },
    { name: 'Clemson University', tier: 'Selective', avgGPA: 4.43, avgSAT: 1290, avgACT: 29, acceptanceRate: 42.5, region: 'South', type: 'Public', state: 'SC' },
    { name: 'University of Tennessee-Knoxville', tier: 'Selective', avgGPA: 4.00, avgSAT: 1240, avgACT: 27, acceptanceRate: 68.0, region: 'South', type: 'Public', state: 'TN' },
    { name: 'Auburn University', tier: 'Selective', avgGPA: 3.85, avgSAT: 1220, avgACT: 27, acceptanceRate: 71.2, region: 'South', type: 'Public', state: 'AL' },
    { name: 'University of Alabama', tier: 'Selective', avgGPA: 3.71, avgSAT: 1180, avgACT: 26, acceptanceRate: 77.5, region: 'South', type: 'Public', state: 'AL' },
    { name: 'University of Kentucky', tier: 'Selective', avgGPA: 3.61, avgSAT: 1160, avgACT: 25, acceptanceRate: 94.9, region: 'South', type: 'Public', state: 'KY' },
    { name: 'Louisiana State University', tier: 'Selective', avgGPA: 3.50, avgSAT: 1160, avgACT: 25, acceptanceRate: 74.6, region: 'South', type: 'Public', state: 'LA' },
    { name: 'University of Arkansas', tier: 'Selective', avgGPA: 3.62, avgSAT: 1160, avgACT: 25, acceptanceRate: 78.6, region: 'South', type: 'Public', state: 'AR' },
    { name: 'University of Oklahoma', tier: 'Selective', avgGPA: 3.62, avgSAT: 1180, avgACT: 25, acceptanceRate: 86.5, region: 'South', type: 'Public', state: 'OK' },
    { name: 'Oklahoma State University', tier: 'Selective', avgGPA: 3.58, avgSAT: 1130, avgACT: 24, acceptanceRate: 70.6, region: 'South', type: 'Public', state: 'OK' },
    { name: 'University of Missouri-Columbia', tier: 'Selective', avgGPA: 3.60, avgSAT: 1200, avgACT: 26, acceptanceRate: 79.1, region: 'Midwest', type: 'Public', state: 'MO' },
    { name: 'University of Kansas', tier: 'Selective', avgGPA: 3.60, avgSAT: 1190, avgACT: 25, acceptanceRate: 91.2, region: 'Midwest', type: 'Public', state: 'KS' },
    { name: 'Kansas State University', tier: 'Selective', avgGPA: 3.52, avgSAT: 1130, avgACT: 24, acceptanceRate: 95.0, region: 'Midwest', type: 'Public', state: 'KS' },
    { name: 'University of Nebraska-Lincoln', tier: 'Selective', avgGPA: 3.65, avgSAT: 1200, avgACT: 25, acceptanceRate: 78.6, region: 'Midwest', type: 'Public', state: 'NE' },
    { name: 'University of Connecticut', tier: 'Selective', avgGPA: 3.76, avgSAT: 1320, avgACT: 30, acceptanceRate: 55.5, region: 'Northeast', type: 'Public', state: 'CT' },
    { name: 'University of Massachusetts-Amherst', tier: 'Selective', avgGPA: 3.90, avgSAT: 1290, avgACT: 29, acceptanceRate: 63.5, region: 'Northeast', type: 'Public', state: 'MA' },
    { name: 'University of Delaware', tier: 'Selective', avgGPA: 3.74, avgSAT: 1260, avgACT: 28, acceptanceRate: 73.8, region: 'Northeast', type: 'Public', state: 'DE' },
    { name: 'University of Vermont', tier: 'Selective', avgGPA: 3.69, avgSAT: 1260, avgACT: 28, acceptanceRate: 59.8, region: 'Northeast', type: 'Public', state: 'VT' },
    { name: 'University of New Hampshire', tier: 'Selective', avgGPA: 3.60, avgSAT: 1180, avgACT: 26, acceptanceRate: 87.0, region: 'Northeast', type: 'Public', state: 'NH' },
    { name: 'University of Maine', tier: 'Selective', avgGPA: 3.42, avgSAT: 1140, avgACT: 24, acceptanceRate: 93.9, region: 'Northeast', type: 'Public', state: 'ME' },
    { name: 'University of Rhode Island', tier: 'Selective', avgGPA: 3.58, avgSAT: 1190, avgACT: 26, acceptanceRate: 76.4, region: 'Northeast', type: 'Public', state: 'RI' },
    { name: 'University of Nevada-Reno', tier: 'Selective', avgGPA: 3.45, avgSAT: 1120, avgACT: 23, acceptanceRate: 86.3, region: 'West', type: 'Public', state: 'NV' },
    { name: 'University of Nevada-Las Vegas', tier: 'Selective', avgGPA: 3.34, avgSAT: 1060, avgACT: 22, acceptanceRate: 84.8, region: 'West', type: 'Public', state: 'NV' },
    { name: 'University of Utah', tier: 'Selective', avgGPA: 3.66, avgSAT: 1230, avgACT: 26, acceptanceRate: 89.1, region: 'West', type: 'Public', state: 'UT' },
    { name: 'University of New Mexico', tier: 'Selective', avgGPA: 3.40, avgSAT: 1100, avgACT: 22, acceptanceRate: 96.8, region: 'West', type: 'Public', state: 'NM' },
    { name: 'University of Idaho', tier: 'Selective', avgGPA: 3.55, avgSAT: 1120, avgACT: 23, acceptanceRate: 74.0, region: 'West', type: 'Public', state: 'ID' },
    { name: 'University of Montana', tier: 'Selective', avgGPA: 3.48, avgSAT: 1140, avgACT: 24, acceptanceRate: 95.4, region: 'West', type: 'Public', state: 'MT' },
    { name: 'University of Wyoming', tier: 'Selective', avgGPA: 3.50, avgSAT: 1130, avgACT: 24, acceptanceRate: 95.5, region: 'West', type: 'Public', state: 'WY' },
    { name: 'University of North Dakota', tier: 'Selective', avgGPA: 3.47, avgSAT: 1140, avgACT: 24, acceptanceRate: 83, region: 'Midwest', type: 'Public', state: 'ND' },
    { name: 'University of South Dakota', tier: 'Selective', avgGPA: 3.49, avgSAT: 1130, avgACT: 24, acceptanceRate: 99.5, region: 'Midwest', type: 'Public', state: 'SD' },
    { name: 'University of Mississippi', tier: 'Selective', avgGPA: 3.60, avgSAT: 1130, avgACT: 24, acceptanceRate: 97.4, region: 'South', type: 'Public', state: 'MS' },
    { name: 'Mississippi State University', tier: 'Selective', avgGPA: 3.56, avgSAT: 1120, avgACT: 24, acceptanceRate: 75.2, region: 'South', type: 'Public', state: 'MS' },
    { name: 'West Virginia University', tier: 'Selective', avgGPA: 3.59, avgSAT: 1090, avgACT: 23, acceptanceRate: 89.2, region: 'South', type: 'Public', state: 'WV' },
    { name: 'University of Hawaii at Manoa', tier: 'Selective', avgGPA: 3.74, avgSAT: 1170, avgACT: 24, acceptanceRate: 84.0, region: 'West', type: 'Public', state: 'HI' },
    { name: 'University of Alaska Fairbanks', tier: 'Selective', avgGPA: 3.46, avgSAT: 1110, avgACT: 22, acceptanceRate: 91.3, region: 'West', type: 'Public', state: 'AK' },

    // Selective Tier - State Flagships
    { name: 'Pennsylvania State University', tier: 'Selective', avgGPA: 3.67, avgSAT: 1265, avgACT: 28, acceptanceRate: 54.5, region: 'Northeast', type: 'Public', state: 'PA' },
    { name: 'University of Maryland-College Park', tier: 'Selective', avgGPA: 4.32, avgSAT: 1380, avgACT: 31, acceptanceRate: 44.5, region: 'South', type: 'Public', state: 'MD' },
    { name: 'Purdue University', tier: 'Selective', avgGPA: 3.74, avgSAT: 1290, avgACT: 29, acceptanceRate: 52.7, region: 'Midwest', type: 'Public', state: 'IN' },
    { name: 'University of Minnesota-Twin Cities', tier: 'Selective', avgGPA: 3.80, avgSAT: 1340, avgACT: 29, acceptanceRate: 74.9, region: 'Midwest', type: 'Public', state: 'MN' },
    { name: 'Rutgers University-New Brunswick', tier: 'Selective', avgGPA: 3.73, avgSAT: 1320, avgACT: 29, acceptanceRate: 66.3, region: 'Northeast', type: 'Public', state: 'NJ' },
    { name: 'University of Pittsburgh', tier: 'Selective', avgGPA: 4.07, avgSAT: 1330, avgACT: 30, acceptanceRate: 49.1, region: 'Northeast', type: 'Public', state: 'PA' },
    { name: 'Michigan State University', tier: 'Selective', avgGPA: 3.71, avgSAT: 1210, avgACT: 26, acceptanceRate: 83.3, region: 'Midwest', type: 'Public', state: 'MI' },
    { name: 'Indiana University Bloomington', tier: 'Selective', avgGPA: 3.76, avgSAT: 1265, avgACT: 28, acceptanceRate: 82.0, region: 'Midwest', type: 'Public', state: 'IN' },
    { name: 'University of Iowa', tier: 'Selective', avgGPA: 3.71, avgSAT: 1210, avgACT: 26, acceptanceRate: 86.1, region: 'Midwest', type: 'Public', state: 'IA' },
    { name: 'Iowa State University', tier: 'Selective', avgGPA: 3.64, avgSAT: 1195, avgACT: 26, acceptanceRate: 90.3, region: 'Midwest', type: 'Public', state: 'IA' },
    { name: 'University of Connecticut', tier: 'Selective', avgGPA: 3.76, avgSAT: 1320, avgACT: 30, acceptanceRate: 55.5, region: 'Northeast', type: 'Public', state: 'CT' },
    { name: 'University of Massachusetts Amherst', tier: 'Selective', avgGPA: 3.90, avgSAT: 1310, avgACT: 30, acceptanceRate: 63.5, region: 'Northeast', type: 'Public', state: 'MA' },
    { name: 'University of Delaware', tier: 'Selective', avgGPA: 3.70, avgSAT: 1270, avgACT: 28, acceptanceRate: 73.8, region: 'Northeast', type: 'Public', state: 'DE' },

    // Selective Tier - Southern Universities
    { name: 'University of Georgia', tier: 'Selective', avgGPA: 4.00, avgSAT: 1330, avgACT: 30, acceptanceRate: 42.5, region: 'South', type: 'Public', state: 'GA' },
    { name: 'University of Alabama', tier: 'Selective', avgGPA: 3.71, avgSAT: 1210, avgACT: 27, acceptanceRate: 80.5, region: 'South', type: 'Public', state: 'AL' },
    { name: 'Auburn University', tier: 'Selective', avgGPA: 3.85, avgSAT: 1230, avgACT: 27, acceptanceRate: 71.4, region: 'South', type: 'Public', state: 'AL' },
    { name: 'Clemson University', tier: 'Selective', avgGPA: 4.43, avgSAT: 1290, avgACT: 29, acceptanceRate: 43.1, region: 'South', type: 'Public', state: 'SC' },
    { name: 'University of South Carolina', tier: 'Selective', avgGPA: 4.11, avgSAT: 1240, avgACT: 27, acceptanceRate: 64.5, region: 'South', type: 'Public', state: 'SC' },
    { name: 'University of Tennessee-Knoxville', tier: 'Selective', avgGPA: 4.00, avgSAT: 1230, avgACT: 27, acceptanceRate: 68.4, region: 'South', type: 'Public', state: 'TN' },
    { name: 'Louisiana State University', tier: 'Selective', avgGPA: 3.50, avgSAT: 1175, avgACT: 25, acceptanceRate: 76.3, region: 'South', type: 'Public', state: 'LA' },
    { name: 'University of Kentucky', tier: 'Selective', avgGPA: 3.61, avgSAT: 1180, avgACT: 25, acceptanceRate: 94.9, region: 'South', type: 'Public', state: 'KY' },
    { name: 'University of Arkansas', tier: 'Selective', avgGPA: 3.71, avgSAT: 1195, avgACT: 26, acceptanceRate: 78.6, region: 'South', type: 'Public', state: 'AR' },
    { name: 'University of Mississippi', tier: 'Selective', avgGPA: 3.60, avgSAT: 1145, avgACT: 24, acceptanceRate: 97.4, region: 'South', type: 'Public', state: 'MS' },
    { name: 'Mississippi State University', tier: 'Selective', avgGPA: 3.58, avgSAT: 1155, avgACT: 24, acceptanceRate: 75.2, region: 'South', type: 'Public', state: 'MS' },
    { name: 'Texas A&M University', tier: 'Selective', avgGPA: 3.69, avgSAT: 1260, avgACT: 28, acceptanceRate: 63.1, region: 'South', type: 'Public', state: 'TX' },
    { name: 'University of Oklahoma', tier: 'Selective', avgGPA: 3.62, avgSAT: 1205, avgACT: 26, acceptanceRate: 86.6, region: 'South', type: 'Public', state: 'OK' },
    { name: 'Oklahoma State University', tier: 'Selective', avgGPA: 3.58, avgSAT: 1145, avgACT: 24, acceptanceRate: 70.6, region: 'South', type: 'Public', state: 'OK' },
    

    // Selective Tier - Western Universities
    { name: 'University of Colorado Boulder', tier: 'Selective', avgGPA: 3.69, avgSAT: 1280, avgACT: 28, acceptanceRate: 80.7, region: 'West', type: 'Public', state: 'CO' },
    { name: 'Colorado State University', tier: 'Selective', avgGPA: 3.67, avgSAT: 1200, avgACT: 26, acceptanceRate: 90.9, region: 'West', type: 'Public', state: 'CO' },
    { name: 'University of Arizona', tier: 'Selective', avgGPA: 3.43, avgSAT: 1210, avgACT: 25, acceptanceRate: 87.0, region: 'West', type: 'Public', state: 'AZ' },
    { name: 'Arizona State University', tier: 'Selective', avgGPA: 3.54, avgSAT: 1220, avgACT: 25, acceptanceRate: 89.8, region: 'West', type: 'Public', state: 'AZ' },
    { name: 'University of Utah', tier: 'Selective', avgGPA: 3.66, avgSAT: 1245, avgACT: 27, acceptanceRate: 89.2, region: 'West', type: 'Public', state: 'UT' },
    { name: 'University of Oregon', tier: 'Selective', avgGPA: 3.59, avgSAT: 1190, avgACT: 26, acceptanceRate: 86.3, region: 'West', type: 'Public', state: 'OR' },
    { name: 'Oregon State University', tier: 'Selective', avgGPA: 3.59, avgSAT: 1170, avgACT: 25, acceptanceRate: 82.6, region: 'West', type: 'Public', state: 'OR' },
    { name: 'University of Nevada-Reno', tier: 'Selective', avgGPA: 3.40, avgSAT: 1120, avgACT: 23, acceptanceRate: 85.7, region: 'West', type: 'Public', state: 'NV' },
    { name: 'University of New Mexico', tier: 'Selective', avgGPA: 3.40, avgSAT: 1120, avgACT: 22, acceptanceRate: 96.6, region: 'West', type: 'Public', state: 'NM' },
    { name: 'Washington State University', tier: 'Selective', avgGPA: 3.42, avgSAT: 1155, avgACT: 24, acceptanceRate: 83.1, region: 'West', type: 'Public', state: 'WA' },

    
     // Elite Tier - Northeast Liberal Arts Colleges
    { name: 'Williams College', tier: 'Elite', avgGPA: 3.95, avgSAT: 1485, avgACT: 33, acceptanceRate: 8.7, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Amherst College', tier: 'Elite', avgGPA: 3.97, avgSAT: 1470, avgACT: 33, acceptanceRate: 7.3, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Swarthmore College', tier: 'Elite', avgGPA: 4.07, avgSAT: 1470, avgACT: 33, acceptanceRate: 6.9, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Wellesley College', tier: 'Elite', avgGPA: 3.91, avgSAT: 1420, avgACT: 32, acceptanceRate: 13.6, region: 'Northeast', type: 'Private', state: 'MA' },
    { name: 'Pomona College', tier: 'Elite', avgGPA: 3.95, avgSAT: 1460, avgACT: 33, acceptanceRate: 7.0, region: 'West', type: 'Private', state: 'CA' },
    { name: 'Bowdoin College', tier: 'Elite', avgGPA: 3.95, avgSAT: 1430, avgACT: 33, acceptanceRate: 9.1, region: 'Northeast', type: 'Private', state: 'ME' },
    { name: 'Carleton College', tier: 'Highly Selective', avgGPA: 3.85, avgSAT: 1430, avgACT: 32, acceptanceRate: 17.2, region: 'Midwest', type: 'Private', state: 'MN' },
    { name: 'Claremont McKenna College', tier: 'Elite', avgGPA: 3.95, avgSAT: 1440, avgACT: 32, acceptanceRate: 10.4, region: 'West', type: 'Private', state: 'CA' },
    { name: 'Middlebury College', tier: 'Elite', avgGPA: 3.91, avgSAT: 1410, avgACT: 32, acceptanceRate: 12.8, region: 'Northeast', type: 'Private', state: 'VT' },
    
    // Highly Selective Tier - Liberal Arts Colleges
    { name: 'Colgate University', tier: 'Highly Selective', avgGPA: 3.79, avgSAT: 1410, avgACT: 32, acceptanceRate: 12.5, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Hamilton College', tier: 'Highly Selective', avgGPA: 3.80, avgSAT: 1420, avgACT: 32, acceptanceRate: 11.8, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Haverford College', tier: 'Highly Selective', avgGPA: 3.89, avgSAT: 1440, avgACT: 33, acceptanceRate: 13.3, region: 'Northeast', type: 'Private', state: 'PA' },
    { name: 'Vassar College', tier: 'Highly Selective', avgGPA: 3.80, avgSAT: 1410, avgACT: 32, acceptanceRate: 18.7, region: 'Northeast', type: 'Private', state: 'NY' },
    { name: 'Grinnell College', tier: 'Highly Selective', avgGPA: 3.88, avgSAT: 1390, avgACT: 32, acceptanceRate: 10.8, region: 'Midwest', type: 'Private', state: 'IA' }
  ];

  const majors = [
    // STEM Majors
    'Computer Science', 'Computer Engineering', 'Software Engineering', 'Information Technology',
    'Data Science', 'Artificial Intelligence', 'Cybersecurity', 'Information Systems',
    'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering',
    'Aerospace Engineering', 'Biomedical Engineering', 'Industrial Engineering', 'Environmental Engineering',
    'Materials Science', 'Nuclear Engineering', 'Petroleum Engineering', 'Agricultural Engineering',
    'Mathematics', 'Applied Mathematics', 'Statistics', 'Actuarial Science',
    'Physics', 'Applied Physics', 'Astrophysics', 'Geophysics',
    'Chemistry', 'Biochemistry', 'Chemical Physics', 'Pharmaceutical Sciences',
    'Biology', 'Molecular Biology', 'Microbiology', 'Marine Biology', 'Ecology',
    'Biotechnology', 'Genetics', 'Bioinformatics', 'Neuroscience', 'Neurobiology',
    'Environmental Science', 'Environmental Studies', 'Sustainability Studies',
    'Geology', 'Earth Sciences', 'Meteorology', 'Oceanography',
    'Architecture', 'Landscape Architecture', 'Urban Planning',
    
    // Health Sciences
    'Pre-Medicine', 'Pre-Dental', 'Pre-Veterinary', 'Pre-Pharmacy', 'Pre-Physical Therapy',
    'Nursing', 'Public Health', 'Health Sciences', 'Health Administration',
    'Kinesiology', 'Exercise Science', 'Sports Medicine', 'Athletic Training',
    'Nutrition', 'Dietetics', 'Food Science', 'Speech Pathology',
    'Occupational Therapy', 'Respiratory Therapy', 'Radiologic Sciences',
    'Medical Laboratory Science', 'Clinical Laboratory Science',
    
    // Business & Economics
    'Business Administration', 'Business Management', 'International Business',
    'Finance', 'Accounting', 'Economics', 'Applied Economics',
    'Marketing', 'Digital Marketing', 'Brand Management',
    'Management Information Systems', 'Supply Chain Management', 'Operations Management',
    'Entrepreneurship', 'Human Resources Management', 'Organizational Leadership',
    'Real Estate', 'Risk Management', 'Business Analytics',
    'Hospitality Management', 'Tourism Management', 'Event Management',
    'Sports Management', 'Healthcare Management',
    
    // Social Sciences
    'Psychology', 'Clinical Psychology', 'Cognitive Science', 'Behavioral Science',
    'Sociology', 'Anthropology', 'Archaeology', 'Cultural Studies',
    'Political Science', 'International Relations', 'Public Policy', 'Public Administration',
    'Economics', 'Social Work', 'Criminal Justice', 'Criminology',
    'Geography', 'Urban Studies', 'Gender Studies', "Women's Studies",
    'African American Studies', 'Asian Studies', 'Latin American Studies', 'Middle Eastern Studies',
    
    // Humanities & Liberal Arts
    'English', 'English Literature', 'Creative Writing', 'Professional Writing',
    'History', 'Art History', 'American Studies', 'Classical Studies',
    'Philosophy', 'Ethics', 'Religious Studies', 'Theology',
    'Linguistics', 'Comparative Literature', 'Foreign Languages',
    'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Arabic', 'Russian',
    
    // Communication & Media
    'Communications', 'Mass Communications', 'Strategic Communications',
    'Journalism', 'Broadcast Journalism', 'Digital Journalism',
    'Public Relations', 'Advertising', 'Media Studies',
    'Film Studies', 'Film Production', 'Television Production',
    'Digital Media', 'Multimedia Design', 'Game Design',
    
    // Arts & Design
    'Fine Arts', 'Studio Art', 'Painting', 'Sculpture', 'Ceramics',
    'Graphic Design', 'Visual Communications', 'Illustration',
    'Photography', 'Fashion Design', 'Interior Design', 'Industrial Design',
    'Animation', 'Digital Arts', 'Web Design', 'UX/UI Design',
    
    // Performing Arts
    'Music', 'Music Performance', 'Music Education', 'Music Theory', 'Music Composition',
    'Theatre', 'Theatre Arts', 'Acting', 'Musical Theatre', 'Technical Theatre',
    'Dance', 'Choreography', 'Dance Education',
    
    // Education
    'Education', 'Elementary Education', 'Secondary Education', 'Special Education',
    'Early Childhood Education', 'Physical Education', 'Music Education', 'Art Education',
    'Educational Leadership', 'Curriculum and Instruction', 'Educational Psychology',
    
    // Law & Legal Studies
    'Pre-Law', 'Legal Studies', 'Paralegal Studies', 'Constitutional Law',
    
    // Agriculture & Natural Resources
    'Agriculture', 'Agricultural Business', 'Agricultural Science', 'Agronomy',
    'Animal Science', 'Veterinary Science', 'Equine Studies',
    'Forestry', 'Wildlife Management', 'Fisheries Science', 'Range Science',
    'Horticulture', 'Plant Science', 'Soil Science',
    
    // Other Professional Fields
    'Library Science', 'Museum Studies', 'Archival Studies',
    'Aviation', 'Aeronautics', 'Aviation Management',
    'Culinary Arts', 'Baking and Pastry Arts',
    'Fashion Merchandising', 'Retail Management',
    'Construction Management', 'Project Management',
    'Human Development', 'Family Studies', 'Child Development',
    'Gerontology', 'Recreation Management', 'Parks and Recreation',
    'Military Science', 'National Security Studies', 'Intelligence Studies',
    'Undecided/Exploratory'
  ];

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
  ];

  const filteredUniversities = useMemo(() => {
    return universities.filter(uni => {
      const matchesSearch = uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           uni.state.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = filters.tier === 'all' || uni.tier === filters.tier;
      const matchesRegion = filters.region === 'all' || uni.region === filters.region;
      const matchesType = filters.type === 'all' || uni.type === filters.type;
      
      return matchesSearch && matchesTier && matchesRegion && matchesType;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, filters]);

  const calculateAdmitScore = () => {
    const uni = universities.find(u => u.name === studentData.university);
    if (!uni) return null;

    let academicScore = 0;
    let extracurricularScore = 0;
    let diversityScore = 0;
    
    const gpaScore = (parseFloat(studentData.gpa) / uni.avgGPA) * 35;
    
    let testScore = 0;
    if (studentData.satScore) {
      testScore = (parseInt(studentData.satScore) / uni.avgSAT) * 35;
    } else if (studentData.actScore) {
      testScore = (parseInt(studentData.actScore) / uni.avgACT) * 35;
    }
    
    const apScore = Math.min(30, (parseInt(studentData.apCourses || 0) / 10) * 30);
    academicScore = Math.min(100, gpaScore + testScore + apScore);

    const leadershipScore = parseInt(studentData.leadership || 0) * 10;
    const serviceScore = Math.min(25, (parseInt(studentData.communityService || 0) / 400) * 25);
    const athleticsScore = parseInt(studentData.athletics || 0) * 8;
    const researchScore = parseInt(studentData.researchProjects || 0) * 12;
    const internshipScore = parseInt(studentData.internships || 0) * 10;
    const awardsScore = Math.min(15, parseInt(studentData.awards || 0) * 5);
    extracurricularScore = Math.min(100, leadershipScore + serviceScore + athleticsScore + researchScore + internshipScore + awardsScore);

    let baseHolistic = 60;
    const incomeBonus = parseInt(studentData.familyIncome) < 60000 ? 15 : 0;
    const firstGenBonus = studentData.firstGen ? 15 : 0;
    const underrepBonus = studentData.underrepresented ? 10 : 0;
    diversityScore = Math.min(100, baseHolistic + incomeBonus + firstGenBonus + underrepBonus);

    const finalScore = (academicScore * 0.45 + extracurricularScore * 0.35 + diversityScore * 0.20);
    
    const tierMultipliers = {
      'Elite': 0.75,
      'Highly Selective': 0.85,
      'Selective': 0.92,
      'Moderate': 1.00
    };
    
    const admitProbability = Math.min(97, finalScore * tierMultipliers[uni.tier]);

    const gaps = [];
    
    if (parseFloat(studentData.gpa) < uni.avgGPA - 0.1) {
      gaps.push({
        area: 'GPA',
        current: parseFloat(studentData.gpa),
        target: uni.avgGPA,
        gap: (uni.avgGPA - parseFloat(studentData.gpa)).toFixed(2),
        impact: 'High'
      });
    }
    
    if (studentData.satScore && parseInt(studentData.satScore) < uni.avgSAT - 50) {
      gaps.push({
        area: 'SAT Score',
        current: parseInt(studentData.satScore),
        target: uni.avgSAT,
        gap: uni.avgSAT - parseInt(studentData.satScore),
        impact: 'High'
      });
    }
    
    if (parseInt(studentData.apCourses || 0) < 6 && uni.tier === 'Elite') {
      gaps.push({
        area: 'AP/IB Courses',
        current: parseInt(studentData.apCourses || 0),
        target: 8,
        gap: 8 - parseInt(studentData.apCourses || 0),
        impact: 'Medium'
      });
    }
    
    if (parseInt(studentData.leadership || 0) < 2) {
      gaps.push({
        area: 'Leadership',
        current: parseInt(studentData.leadership || 0),
        target: 3,
        gap: 3 - parseInt(studentData.leadership || 0),
        impact: 'Medium'
      });
    }

    const recommendations = [];
    
    if (parseFloat(studentData.gpa) < uni.avgGPA - 0.1) {
      recommendations.push({
        priority: 'High',
        action: 'Academic Performance',
        steps: [
          `Raise GPA from ${studentData.gpa} to ${uni.avgGPA}+`,
          'Focus on core subjects aligned with major',
          'Seek tutoring for challenging subjects',
          'Take challenging courses with strong performance'
        ],
        timeline: '1-2 semesters',
        expectedImpact: '+10-15%'
      });
    }

    if ((studentData.satScore && parseInt(studentData.satScore) < uni.avgSAT - 50) || 
        (studentData.actScore && parseInt(studentData.actScore) < uni.avgACT - 2)) {
      recommendations.push({
        priority: 'High',
        action: 'Standardized Testing',
        steps: [
          `Target: SAT ${uni.avgSAT}+ or ACT ${uni.avgACT}+`,
          'Dedicate 3-4 months to test prep',
          'Take practice tests weekly',
          'Focus on weak areas'
        ],
        timeline: '3-6 months',
        expectedImpact: '+12-18%'
      });
    }

    if (parseInt(studentData.leadership || 0) < 2) {
      recommendations.push({
        priority: 'Medium',
        action: 'Leadership Development',
        steps: [
          'Run for officer positions',
          'Start a new club',
          'Take team captain roles',
          'Document leadership impact'
        ],
        timeline: '6-12 months',
        expectedImpact: '+5-8%'
      });
    }

    recommendations.push({
      priority: 'High',
      action: 'Application Excellence',
      steps: [
        'Craft compelling personal essays',
        'Secure strong recommendation letters',
        'Demonstrate genuine interest',
        'Apply Early Action/Decision if top choice'
      ],
      timeline: '3-6 months',
      expectedImpact: '+8-12%'
    });

    const scenarioData = [
      { scenario: 'Current', probability: Math.round(admitProbability) },
      { scenario: 'GPA +0.2', probability: Math.min(97, Math.round(admitProbability + 8)) },
      { scenario: 'Test +100', probability: Math.min(97, Math.round(admitProbability + 12)) },
      { scenario: 'All Improvements', probability: Math.min(97, Math.round(admitProbability + 25)) }
    ];

    return {
      admitScore: Math.round(admitProbability),
      academicScore: Math.round(academicScore),
      extracurricularScore: Math.round(extracurricularScore),
      diversityScore: Math.round(diversityScore),
      university: uni,
      gaps,
      recommendations,
      scenarioData,
      componentScores: [
        { category: 'Academic', score: Math.round(academicScore), fullMark: 100 },
        { category: 'Extracurricular', score: Math.round(extracurricularScore), fullMark: 100 },
        { category: 'Leadership', score: Math.min(100, parseInt(studentData.leadership || 0) * 25), fullMark: 100 },
        { category: 'Service', score: Math.min(100, (parseInt(studentData.communityService || 0) / 300) * 100), fullMark: 100 },
        { category: 'Holistic', score: Math.round(diversityScore), fullMark: 100 }
      ]
    };
  };

  const handleSubmit = () => {
    if (!studentData.university || !studentData.gpa || (!studentData.satScore && !studentData.actScore)) {
      alert('Please fill in university, GPA, and at least one test score');
      return;
    }
    const calculatedResults = calculateAdmitScore();
    setResults(calculatedResults);
    setCurrentStep('results');
  };

  const handleInputChange = (field, value) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    if (score >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 70) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    if (score >= 30) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Chance';
    if (score >= 60) return 'Strong Chance';
    if (score >= 40) return 'Moderate Chance';
    if (score >= 20) return 'Reach School';
    return 'High Reach';
  };

  if (currentStep === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <GraduationCap className="w-16 h-16 text-indigo-600" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-3">
                College Admit Score Pro
              </h1>
              <p className="text-gray-600 text-lg">
                AI-Powered Admission Probability for 100+ US Universities
              </p>
              <div className="mt-4 flex justify-center gap-4 text-sm text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  Predictive Analytics
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  Gap Analysis
                </span>
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  Action Plans
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-indigo-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Target University
                </h3>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search universities..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    <Filter className="w-4 h-4" />
                    {showFilters ? 'Hide' : 'Show'} Filters
                  </button>

                  {showFilters && (
                    <div className="grid md:grid-cols-3 gap-4 p-4 bg-white rounded-lg">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tier
                        </label>
                        <select
                          value={filters.tier}
                          onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="all">All Tiers</option>
                          <option value="Elite">Elite</option>
                          <option value="Highly Selective">Highly Selective</option>
                          <option value="Selective">Selective</option>
                          <option value="Moderate">Moderate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region
                        </label>
                        <select
                          value={filters.region}
                          onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="all">All Regions</option>
                          <option value="Northeast">Northeast</option>
                          <option value="South">South</option>
                          <option value="Midwest">Midwest</option>
                          <option value="West">West</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={filters.type}
                          onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="all">All Types</option>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <select
                    value={studentData.university}
                    onChange={(e) => handleInputChange('university', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select University *</option>
                    {filteredUniversities.map(uni => (
                      <option key={uni.name} value={uni.name}>
                        {uni.name} - {uni.tier} ({uni.state})
                      </option>
                    ))}
                  </select>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Intended Major *
                      </label>
                      <select
                        value={studentData.intendedMajor}
                        onChange={(e) => handleInputChange('intendedMajor', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Major</option>
                        {majors.map(major => (
                          <option key={major} value={major}>{major}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your State
                      </label>
                      <select
                        value={studentData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select State</option>
                        {usStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Academic Profile
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GPA (Weighted 4.0+) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={studentData.gpa}
                      onChange={(e) => handleInputChange('gpa', e.target.value)}
                      placeholder="3.85"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SAT Score (400-1600)
                    </label>
                    <input
                      type="number"
                      min="400"
                      max="1600"
                      value={studentData.satScore}
                      onChange={(e) => handleInputChange('satScore', e.target.value)}
                      placeholder="1450"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ACT Score (1-36)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="36"
                      value={studentData.actScore}
                      onChange={(e) => handleInputChange('actScore', e.target.value)}
                      placeholder="32"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AP/IB Courses
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={studentData.apCourses}
                      onChange={(e) => handleInputChange('apCourses', e.target.value)}
                      placeholder="8"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Extracurricular Activities
                </h3>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Leadership Positions
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={studentData.leadership}
                      onChange={(e) => handleInputChange('leadership', e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Community Service Hours
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={studentData.communityService}
                      onChange={(e) => handleInputChange('communityService', e.target.value)}
                      placeholder="250"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Athletics/Arts (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={studentData.athletics}
                      onChange={(e) => handleInputChange('athletics', e.target.value)}
                      placeholder="2"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Research Projects
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={studentData.researchProjects}
                      onChange={(e) => handleInputChange('researchProjects', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Internships
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={studentData.internships}
                      onChange={(e) => handleInputChange('internships', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Awards/Honors
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={studentData.awards}
                      onChange={(e) => handleInputChange('awards', e.target.value)}
                      placeholder="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  Background Information
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Family Income ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={studentData.familyIncome}
                      onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                      placeholder="75000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-7">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="firstGen"
                        checked={studentData.firstGen}
                        onChange={(e) => handleInputChange('firstGen', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="firstGen" className="ml-3 text-sm font-medium text-gray-700">
                        First-Generation College Student
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="underrep"
                        checked={studentData.underrepresented}
                        onChange={(e) => handleInputChange('underrepresented', e.target.checked)}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded"
                      />
                      <label htmlFor="underrep" className="ml-3 text-sm font-medium text-gray-700">
                        Underrepresented Minority
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition duration-200 shadow-lg"
              >
                Calculate Admit Score
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          <button
            onClick={() => setCurrentStep('input')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 font-medium"
          >
            ← Back to Input
          </button>
          
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              {results.university.name}
            </h2>
            <p className="text-gray-600 mb-2">
              {results.university.tier} • {results.university.type} • {results.university.state}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Acceptance Rate: {results.university.acceptanceRate}%
            </p>
            
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
              <div>
                <div className={`text-6xl md:text-7xl font-bold ${getScoreColor(results.admitScore)}`}>
                  {results.admitScore}%
                </div>
                <div className="text-gray-600 font-semibold mt-2">{getScoreLabel(results.admitScore)}</div>
              </div>
              
              <div className="text-left space-y-2">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Academic: {results.academicScore}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  <span className="text-sm">Extracurricular: {results.extracurricularScore}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm">Holistic: {results.diversityScore}%</span>
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-6 mb-2">
              <div
                className={`h-6 rounded-full ${getScoreBgColor(results.admitScore)} transition-all duration-500`}
                style={{ width: `${results.admitScore}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-600" />
            Profile Strength Analysis
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={results.componentScores}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="Your Profile" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Improvement Scenarios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={results.scenarioData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="scenario" />
              <YAxis domain={[0, 100]} />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="probability" fill="#4f46e5" name="Admit Probability %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {results.gaps.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              Gap Analysis
            </h3>
            <div className="space-y-4">
              {results.gaps.map((gap, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-3 bg-yellow-50 rounded-r-lg">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">{gap.area}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Current: <span className="font-medium">{gap.current}</span> | 
                        Target: <span className="font-medium">{gap.target}</span> | 
                        Gap: <span className="font-medium text-red-600">{gap.gap}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      gap.impact === 'High' ? 'bg-red-100 text-red-700' :
                      gap.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {gap.impact} Impact
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-600" />
            Prescriptive Action Plan
          </h3>
          <div className="space-y-6">
            {results.recommendations.map((rec, index) => (
              <div key={index} className="border-2 rounded-xl p-5 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                  <h4 className="font-bold text-lg text-gray-800">{rec.action}</h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    rec.priority === 'High' ? 'bg-red-100 text-red-700' :
                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {rec.priority} Priority
                  </span>
                </div>
                
                <ul className="space-y-2 mb-3">
                  {rec.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="text-indigo-600 mr-2 mt-1">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-center text-sm pt-3 border-t flex-wrap gap-2">
                  <span className="text-gray-600">
                    <strong>Timeline:</strong> {rec.timeline}
                  </span>
                  <span className="font-semibold text-green-600">{rec.expectedImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
          <p className="text-sm text-gray-700">
            <strong>Disclaimer:</strong> This admit score is a predictive estimate based on historical data and statistical models. 
            Actual admission decisions involve holistic review and many subjective factors. Use this as a guidance tool, not a guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdmitScoreApp;