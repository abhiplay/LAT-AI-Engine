import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Grade } from '../grade/grade.entity';
import { Subject } from '../subject/subject.entity';
import { Competency } from '../competency/competency.entity';
import { Region } from '../region/region.entity';
import { School } from '../school/school.entity';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Grade) private gradeRepo: Repository<Grade>,
    @InjectRepository(Subject) private subjectRepo: Repository<Subject>,
    @InjectRepository(Competency) private competencyRepo: Repository<Competency>,
    @InjectRepository(Region) private regionRepo: Repository<Region>,
    @InjectRepository(School) private schoolRepo: Repository<School>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Role) private roleRepo: Repository<Role>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.gradeRepo.count();
    if (count > 0) return;
    await this.seed();
  }

  private async seed() {
    // Roles master
    const roleAdmin = await this.roleRepo.save({ name: 'admin', displayName: 'Admin', description: 'Full access — create questions, review and manage the system' });
    const roleCoord = await this.roleRepo.save({ name: 'coordinator', displayName: 'Coordinator', description: 'Manages students in assigned school and views school reports' });
    const roleStudent = await this.roleRepo.save({ name: 'student', displayName: 'Student', description: 'Takes assessments for their assigned grade' });

    // Grades
    const g3 = await this.gradeRepo.save({ name: 'Class 3', number: 3 });
    const g6 = await this.gradeRepo.save({ name: 'Class 6', number: 6 });
    const g9 = await this.gradeRepo.save({ name: 'Class 9', number: 9 });

    // Class 3 Subjects
    const [m3, evs3, en3, hi3] = await this.subjectRepo.save([
      { name: 'Mathematics', gradeId: g3.id },
      { name: 'Environmental Studies (EVS)', gradeId: g3.id },
      { name: 'English', gradeId: g3.id },
      { name: 'Hindi', gradeId: g3.id },
    ]);

    // Class 6 Subjects
    const [m6, sc6, en6, sst6, hi6] = await this.subjectRepo.save([
      { name: 'Mathematics', gradeId: g6.id },
      { name: 'Science', gradeId: g6.id },
      { name: 'English', gradeId: g6.id },
      { name: 'Social Science', gradeId: g6.id },
      { name: 'Hindi', gradeId: g6.id },
    ]);

    // Class 9 Subjects
    const [m9, sc9, en9, sst9, hi9] = await this.subjectRepo.save([
      { name: 'Mathematics', gradeId: g9.id },
      { name: 'Science', gradeId: g9.id },
      { name: 'English', gradeId: g9.id },
      { name: 'Social Science', gradeId: g9.id },
      { name: 'Hindi', gradeId: g9.id },
    ]);

    // Competencies
    await this.competencyRepo.save([
      // Class 3 - Math
      { code: 'C3-MAT-01', description: 'Reads and writes numbers up to 999 and understands place value (hundreds, tens, ones)', subjectId: m3.id },
      { code: 'C3-MAT-02', description: 'Adds and subtracts 3-digit numbers with and without regrouping', subjectId: m3.id },
      { code: 'C3-MAT-03', description: 'Multiplies single-digit numbers and understands multiplication as repeated addition', subjectId: m3.id },
      { code: 'C3-MAT-04', description: 'Divides objects into equal groups and relates division to multiplication', subjectId: m3.id },
      { code: 'C3-MAT-05', description: 'Identifies and describes basic 2D shapes (triangle, rectangle, square, circle) and 3D shapes', subjectId: m3.id },
      { code: 'C3-MAT-06', description: 'Measures length using standard units (cm, m) and estimates distances', subjectId: m3.id },

      // Class 3 - EVS
      { code: 'C3-EVS-01', description: 'Identifies different types of plants and animals in the local environment and describes their characteristics', subjectId: evs3.id },
      { code: 'C3-EVS-02', description: 'Understands the importance of food, water and air for living things', subjectId: evs3.id },
      { code: 'C3-EVS-03', description: 'Describes family relationships and roles of different family members in the community', subjectId: evs3.id },
      { code: 'C3-EVS-04', description: 'Identifies different means of transport and communication and their uses', subjectId: evs3.id },

      // Class 3 - English
      { code: 'C3-ENG-01', description: 'Reads simple texts with comprehension and answers questions based on the passage', subjectId: en3.id },
      { code: 'C3-ENG-02', description: 'Uses nouns, pronouns, and simple adjectives correctly in sentences', subjectId: en3.id },
      { code: 'C3-ENG-03', description: 'Writes simple sentences and short paragraphs on familiar topics', subjectId: en3.id },

      // Class 6 - Math
      { code: 'C6-MAT-01', description: 'Understands and applies the concept of natural numbers, whole numbers and integers on the number line', subjectId: m6.id },
      { code: 'C6-MAT-02', description: 'Performs basic operations on fractions and decimals and applies them in real-life situations', subjectId: m6.id },
      { code: 'C6-MAT-03', description: 'Finds HCF and LCM of numbers using prime factorisation', subjectId: m6.id },
      { code: 'C6-MAT-04', description: 'Solves problems involving ratio, proportion and unitary method', subjectId: m6.id },
      { code: 'C6-MAT-05', description: 'Understands basic concepts of algebra — variables, expressions and simple equations', subjectId: m6.id },
      { code: 'C6-MAT-06', description: 'Identifies and describes properties of basic geometrical shapes — lines, angles, triangles and quadrilaterals', subjectId: m6.id },
      { code: 'C6-MAT-07', description: 'Calculates perimeter and area of rectangles, squares and triangles', subjectId: m6.id },

      // Class 6 - Science
      { code: 'C6-SCI-01', description: 'Classifies living organisms based on their characteristics and understands the cell as the basic unit of life', subjectId: sc6.id },
      { code: 'C6-SCI-02', description: 'Understands components of food, nutritional deficiencies and the importance of a balanced diet', subjectId: sc6.id },
      { code: 'C6-SCI-03', description: 'Distinguishes between physical and chemical changes and identifies reversible and irreversible changes', subjectId: sc6.id },
      { code: 'C6-SCI-04', description: 'Understands the water cycle and the importance of water conservation', subjectId: sc6.id },
      { code: 'C6-SCI-05', description: 'Describes types of motion (linear, circular, periodic) and measures of distance and time', subjectId: sc6.id },

      // Class 6 - Social Science
      { code: 'C6-SST-01', description: 'Understands the diversity of India — geographical, cultural and historical', subjectId: sst6.id },
      { code: 'C6-SST-02', description: 'Reads and interprets maps to locate physical and political features of India', subjectId: sst6.id },
      { code: 'C6-SST-03', description: 'Understands early civilisations and the life of people in ancient India', subjectId: sst6.id },
      { code: 'C6-SST-04', description: 'Understands the concept of government, local self-government and democratic institutions', subjectId: sst6.id },

      // Class 6 - English
      { code: 'C6-ENG-01', description: 'Reads and comprehends unseen passages and answers inferential and factual questions', subjectId: en6.id },
      { code: 'C6-ENG-02', description: 'Applies grammar rules including tenses (simple present, past, future), prepositions and conjunctions', subjectId: en6.id },
      { code: 'C6-ENG-03', description: 'Writes structured paragraphs, letters and short essays on given topics', subjectId: en6.id },

      // Class 9 - Math
      { code: 'C9-MAT-01', description: 'Understands real numbers, irrational numbers and their representation on the number line', subjectId: m9.id },
      { code: 'C9-MAT-02', description: 'Factorises polynomials using algebraic identities and remainder theorem', subjectId: m9.id },
      { code: 'C9-MAT-03', description: 'Solves linear equations in two variables and represents them graphically', subjectId: m9.id },
      { code: 'C9-MAT-04', description: "Applies Euclid's geometry — axioms, postulates and basic theorems on triangles and quadrilaterals", subjectId: m9.id },
      { code: 'C9-MAT-05', description: 'Calculates surface area and volume of cubes, cuboids, cylinders, cones and spheres', subjectId: m9.id },
      { code: 'C9-MAT-06', description: 'Organises data, calculates mean, median and mode and interprets bar graphs and histograms', subjectId: m9.id },
      { code: 'C9-MAT-07', description: 'Understands basic probability concepts and calculates probability of simple events', subjectId: m9.id },

      // Class 9 - Science
      { code: 'C9-SCI-01', description: 'Understands matter — states, properties, and particle nature; distinguishes mixtures from pure substances', subjectId: sc9.id },
      { code: 'C9-SCI-02', description: "Understands atomic structure, isotopes and isobars, and applies Bohr's model", subjectId: sc9.id },
      { code: 'C9-SCI-03', description: "Applies Newton's laws of motion and concepts of force, momentum and gravitation", subjectId: sc9.id },
      { code: 'C9-SCI-04', description: 'Understands work, energy (kinetic and potential) and the law of conservation of energy', subjectId: sc9.id },
      { code: 'C9-SCI-05', description: 'Understands the cell — structure, organelles and differences between plant and animal cells', subjectId: sc9.id },
      { code: 'C9-SCI-06', description: 'Classifies living organisms using the five-kingdom classification and understands diversity of life', subjectId: sc9.id },
      { code: 'C9-SCI-07', description: 'Understands diseases — causes, prevention and importance of health and hygiene', subjectId: sc9.id },

      // Class 9 - Social Science
      { code: 'C9-SST-01', description: 'Understands the causes, course and consequences of the French Revolution', subjectId: sst9.id },
      { code: 'C9-SST-02', description: 'Understands the physical features of India — relief, drainage, climate and natural vegetation', subjectId: sst9.id },
      { code: 'C9-SST-03', description: 'Understands the Indian Constitution — features, fundamental rights and duties', subjectId: sst9.id },
      { code: 'C9-SST-04', description: 'Understands poverty, food security and the role of government in rural development', subjectId: sst9.id },

      // Class 9 - English
      { code: 'C9-ENG-01', description: 'Reads and comprehends literary and non-literary texts, identifies themes and draws inferences', subjectId: en9.id },
      { code: 'C9-ENG-02', description: 'Applies advanced grammar — active/passive voice, direct/indirect speech, modals and clauses', subjectId: en9.id },
      { code: 'C9-ENG-03', description: 'Writes formal letters, reports, articles and descriptive/analytical essays with appropriate structure', subjectId: en9.id },
    ]);

    // Regions
    const [delhi, mumbai, chennai] = await this.regionRepo.save([
      { name: 'Delhi', code: 'DEL' },
      { name: 'Mumbai', code: 'MUM' },
      { name: 'Chennai', code: 'CHN' },
    ]);

    // Schools (2 per region)
    const [ds1, ds2] = await this.schoolRepo.save([
      { name: 'KV No. 1 Delhi', code: 'KV-DEL-01', regionId: delhi.id },
      { name: 'KV No. 2 Delhi', code: 'KV-DEL-02', regionId: delhi.id },
    ]);
    const [ms1] = await this.schoolRepo.save([
      { name: 'KV No. 1 Mumbai', code: 'KV-MUM-01', regionId: mumbai.id },
      { name: 'KV No. 2 Mumbai', code: 'KV-MUM-02', regionId: mumbai.id },
    ]);
    await this.schoolRepo.save([
      { name: 'KV No. 1 Chennai', code: 'KV-CHN-01', regionId: chennai.id },
      { name: 'KV No. 2 Chennai', code: 'KV-CHN-02', regionId: chennai.id },
    ]);

    const hash = (p: string) => bcrypt.hash(p, 10);

    // Admin
    await this.userRepo.save({
      name: 'Admin User', email: 'admin@lat.edu',
      password: await hash('Admin@123'), roleId: roleAdmin.id,
    });

    // Coordinators
    await this.userRepo.save({
      name: 'Delhi Coordinator', email: 'coord.delhi@lat.edu',
      password: await hash('Coord@123'), roleId: roleCoord.id,
      regionId: delhi.id, schoolId: ds1.id,
    });
    await this.userRepo.save({
      name: 'Mumbai Coordinator', email: 'coord.mumbai@lat.edu',
      password: await hash('Coord@123'), roleId: roleCoord.id,
      regionId: mumbai.id, schoolId: ms1.id,
    });

    // Students with auto-generated rollIds
    await this.userRepo.save([
      { name: 'Arjun Sharma', rollId: `SCH${String(ds1.id).padStart(3,'0')}-C3-0001`, password: await hash('Student@123'), roleId: roleStudent.id, regionId: delhi.id, schoolId: ds1.id, gradeId: g3.id, gradeName: 'Class 3' },
      { name: 'Priya Singh',  rollId: `SCH${String(ds1.id).padStart(3,'0')}-C6-0001`, password: await hash('Student@123'), roleId: roleStudent.id, regionId: delhi.id, schoolId: ds1.id, gradeId: g6.id, gradeName: 'Class 6' },
      { name: 'Rohan Verma',  rollId: `SCH${String(ds2.id).padStart(3,'0')}-C9-0001`, password: await hash('Student@123'), roleId: roleStudent.id, regionId: delhi.id, schoolId: ds2.id, gradeId: g9.id, gradeName: 'Class 9' },
      { name: 'Anita Patel',  rollId: `SCH${String(ms1.id).padStart(3,'0')}-C3-0001`, password: await hash('Student@123'), roleId: roleStudent.id, regionId: mumbai.id, schoolId: ms1.id, gradeId: g3.id, gradeName: 'Class 3' },
    ]);

    console.log('Database seeded: roles, grades, subjects, competencies, regions, schools, users');
  }
}
