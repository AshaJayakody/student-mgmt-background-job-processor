const CREATE_BULK_STUDENTS = `mutation createBulkStudents($createStudentInputBulk: [CreateStudentInput!]!) {
    createBulkStudents(createStudentInputBulk: $createStudentInputBulk) {
      id
      firstName
      lastName
      email
      dateOfBirth
    }
  }`;

export default CREATE_BULK_STUDENTS;
