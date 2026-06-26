USE lat;

-- Grades
INSERT INTO grades (name, number) VALUES
('Class 3', 3),
('Class 6', 6),
('Class 9', 9)
ON DUPLICATE KEY UPDATE name=name;

-- =====================
-- SUBJECTS FOR CLASS 3
-- =====================
INSERT INTO subjects (name, gradeId) SELECT 'Mathematics', id FROM grades WHERE number = 3;
INSERT INTO subjects (name, gradeId) SELECT 'Environmental Studies (EVS)', id FROM grades WHERE number = 3;
INSERT INTO subjects (name, gradeId) SELECT 'English', id FROM grades WHERE number = 3;
INSERT INTO subjects (name, gradeId) SELECT 'Hindi', id FROM grades WHERE number = 3;

-- =====================
-- SUBJECTS FOR CLASS 6
-- =====================
INSERT INTO subjects (name, gradeId) SELECT 'Mathematics', id FROM grades WHERE number = 6;
INSERT INTO subjects (name, gradeId) SELECT 'Science', id FROM grades WHERE number = 6;
INSERT INTO subjects (name, gradeId) SELECT 'English', id FROM grades WHERE number = 6;
INSERT INTO subjects (name, gradeId) SELECT 'Social Science', id FROM grades WHERE number = 6;
INSERT INTO subjects (name, gradeId) SELECT 'Hindi', id FROM grades WHERE number = 6;

-- =====================
-- SUBJECTS FOR CLASS 9
-- =====================
INSERT INTO subjects (name, gradeId) SELECT 'Mathematics', id FROM grades WHERE number = 9;
INSERT INTO subjects (name, gradeId) SELECT 'Science', id FROM grades WHERE number = 9;
INSERT INTO subjects (name, gradeId) SELECT 'English', id FROM grades WHERE number = 9;
INSERT INTO subjects (name, gradeId) SELECT 'Social Science', id FROM grades WHERE number = 9;
INSERT INTO subjects (name, gradeId) SELECT 'Hindi', id FROM grades WHERE number = 9;

-- =============================================
-- COMPETENCIES: CLASS 3 - MATHEMATICS
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-01', 'Reads and writes numbers up to 999 and understands place value (hundreds, tens, ones)', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-02', 'Adds and subtracts 3-digit numbers with and without regrouping', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-03', 'Multiplies single-digit numbers and understands multiplication as repeated addition', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-04', 'Divides objects into equal groups and relates division to multiplication', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-05', 'Identifies and describes basic 2D shapes (triangle, rectangle, square, circle) and 3D shapes', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-MAT-06', 'Measures length using standard units (cm, m) and estimates distances', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Mathematics';

-- =============================================
-- COMPETENCIES: CLASS 3 - EVS
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-EVS-01', 'Identifies different types of plants and animals in the local environment and describes their characteristics', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Environmental Studies (EVS)';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-EVS-02', 'Understands the importance of food, water and air for living things', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Environmental Studies (EVS)';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-EVS-03', 'Describes family relationships and roles of different family members in the community', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Environmental Studies (EVS)';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-EVS-04', 'Identifies different means of transport and communication and their uses', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'Environmental Studies (EVS)';

-- =============================================
-- COMPETENCIES: CLASS 3 - ENGLISH
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-ENG-01', 'Reads simple texts with comprehension and answers questions based on the passage', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-ENG-02', 'Uses nouns, pronouns, and simple adjectives correctly in sentences', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C3-ENG-03', 'Writes simple sentences and short paragraphs on familiar topics', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 3 AND s.name = 'English';

-- =============================================
-- COMPETENCIES: CLASS 6 - MATHEMATICS
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-01', 'Understands and applies the concept of natural numbers, whole numbers and integers on the number line', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-02', 'Performs basic operations on fractions and decimals and applies them in real-life situations', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-03', 'Finds HCF and LCM of numbers using prime factorisation', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-04', 'Solves problems involving ratio, proportion and unitary method', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-05', 'Understands basic concepts of algebra — variables, expressions and simple equations', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-06', 'Identifies and describes properties of basic geometrical shapes — lines, angles, triangles and quadrilaterals', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-MAT-07', 'Calculates perimeter and area of rectangles, squares and triangles', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Mathematics';

-- =============================================
-- COMPETENCIES: CLASS 6 - SCIENCE
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SCI-01', 'Classifies living organisms based on their characteristics and understands the cell as the basic unit of life', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SCI-02', 'Understands components of food, nutritional deficiencies and the importance of a balanced diet', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SCI-03', 'Distinguishes between physical and chemical changes and identifies reversible and irreversible changes', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SCI-04', 'Understands the water cycle and the importance of water conservation', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SCI-05', 'Describes types of motion (linear, circular, periodic) and measures of distance and time', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Science';

-- =============================================
-- COMPETENCIES: CLASS 6 - SOCIAL SCIENCE
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SST-01', 'Understands the diversity of India — geographical, cultural and historical', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SST-02', 'Reads and interprets maps to locate physical and political features of India', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SST-03', 'Understands early civilisations and the life of people in ancient India', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-SST-04', 'Understands the concept of government, local self-government and democratic institutions', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'Social Science';

-- =============================================
-- COMPETENCIES: CLASS 6 - ENGLISH
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-ENG-01', 'Reads and comprehends unseen passages and answers inferential and factual questions', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-ENG-02', 'Applies grammar rules including tenses (simple present, past, future), prepositions and conjunctions', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C6-ENG-03', 'Writes structured paragraphs, letters and short essays on given topics', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 6 AND s.name = 'English';

-- =============================================
-- COMPETENCIES: CLASS 9 - MATHEMATICS
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-01', 'Understands real numbers, irrational numbers and their representation on the number line', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-02', 'Factorises polynomials using algebraic identities and remainder theorem', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-03', 'Solves linear equations in two variables and represents them graphically', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-04', 'Applies Euclid''s geometry — axioms, postulates and basic theorems on triangles and quadrilaterals', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-05', 'Calculates surface area and volume of cubes, cuboids, cylinders, cones and spheres', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-06', 'Organises data, calculates mean, median and mode and interprets bar graphs and histograms', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-MAT-07', 'Understands basic probability concepts and calculates probability of simple events', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Mathematics';

-- =============================================
-- COMPETENCIES: CLASS 9 - SCIENCE
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-01', 'Understands matter — states, properties, and particle nature; distinguishes mixtures from pure substances', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-02', 'Understands atomic structure, isotopes and isobars, and applies Bohr''s model', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-03', 'Applies Newton''s laws of motion and concepts of force, momentum and gravitation', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-04', 'Understands work, energy (kinetic and potential) and the law of conservation of energy', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-05', 'Understands the cell — structure, organelles and differences between plant and animal cells', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-06', 'Classifies living organisms using the five-kingdom classification and understands diversity of life', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SCI-07', 'Understands diseases — causes, prevention and importance of health and hygiene', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Science';

-- =============================================
-- COMPETENCIES: CLASS 9 - SOCIAL SCIENCE
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SST-01', 'Understands the causes, course and consequences of the French Revolution', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SST-02', 'Understands the physical features of India — relief, drainage, climate and natural vegetation', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SST-03', 'Understands the Indian Constitution — features, fundamental rights and duties', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Social Science';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-SST-04', 'Understands poverty, food security and the role of government in rural development', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'Social Science';

-- =============================================
-- COMPETENCIES: CLASS 9 - ENGLISH
-- =============================================
INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-ENG-01', 'Reads and comprehends literary and non-literary texts, identifies themes and draws inferences', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-ENG-02', 'Applies advanced grammar — active/passive voice, direct/indirect speech, modals and clauses', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'English';

INSERT INTO competencies (code, description, subjectId)
SELECT 'C9-ENG-03', 'Writes formal letters, reports, articles and descriptive/analytical essays with appropriate structure', s.id
FROM subjects s JOIN grades g ON s.gradeId = g.id WHERE g.number = 9 AND s.name = 'English';
