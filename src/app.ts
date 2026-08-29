type AttendanceStatus = 'Present' | 'Absent' | 'Late';

interface Student {
  roll: string;
  name: string;
}

interface AttendanceRecord {
  _id?: string;
  studentName: string;
  status: AttendanceStatus;
  date: string;
}

const classStudents: Student[] = [
  { roll: 'MCA2504002', name: 'AYUSHI SURESH WASALWAR' },
  { roll: 'MCA2504003', name: 'PRIYA LUHAR' },
  { roll: 'MCA2504004', name: 'BURGUTE ASHWINI BIRMAL' },
  { roll: 'MCA2504006', name: 'VISHAKHA BHAUSAHEB KHILARE' },
  { roll: 'MCA2504008', name: 'KHUSHI DAHARWAL' },
  { roll: 'MCA2504013', name: 'SHRUTI CHANDILKAR' },
  { roll: 'MCA2504021', name: 'SHABARISH P SUJITH' },
  { roll: 'MCA2504022', name: 'PRASANN TERADAL' },
  { roll: 'MCA2504024', name: 'RONAK SURENDRA JAISWAR' },
  { roll: 'MCA2504026', name: 'YASH RAJESH RAUT' },
  { roll: 'MCA2504027', name: 'MAURYA VIBHAV KUMAR VINOD KUMAR' },
  { roll: 'MCA2504028', name: 'KOKALGE SIDHESHWAR SOMNATH' },
  { roll: 'MCA2504029', name: 'AVINASH VIKAS KARALE' },
  { roll: 'MCA2504030', name: 'PARIKSHIT MOIN' },
  { roll: 'MCA2504032', name: 'TEJAS RAJU HUDEKAR' },
  { roll: 'MCA2504034', name: 'PRAVIN' },
  { roll: 'MCA2504038', name: 'TUSHAR RAJPUROHIT' },
  { roll: 'MCA2504041', name: 'NIKHIL CHEJARA' },
  { roll: 'MCA2504043', name: 'KRUSHNA SHAHADEV SHENDE' },
  { roll: 'MCA2504044', name: 'UJMA CHAND MULANI' },
  { roll: 'MCA2504054', name: 'PRERNA PRAVIN KANHERKAR' },
  { roll: 'MCA2504056', name: 'SAMIKSHA SAHARE' },
  { roll: 'MCA2504058', name: 'BHAWANA GAHLOT' },
  { roll: 'MCA2504061', name: 'DNYANESHWAR DHUMALE' },
  { roll: 'MCA2504062', name: 'PRADEEP ASHOK KALAMB' },
  { roll: 'MCA2504066', name: 'RAJAT VIJAY WARUDE' },
  { roll: 'MCA2504072', name: 'KOLAMBE YASH VIKAS' },
  { roll: 'MCA2504088', name: 'AKANKSHA BAJRANGBALI KERLE' },
  { roll: 'MCA2504096', name: 'PRATIKSHA KADAM' },
  { roll: 'MCA2504097', name: 'VAISHNAVI JEEVAN SHIRKE' },
  { roll: 'MCA2504103', name: 'SAUJANYA KHARAT' },
  { roll: 'MCA2504104', name: 'TANMAY MANE' },
  { roll: 'MCA2504107', name: 'SWARAJ ASHOK MARATHE' },
  { roll: 'MCA2504110', name: 'ANISH GAUR' },
  { roll: 'MCA2504113', name: 'AMBAR DEVANAND MASURKAR' },
  { roll: 'MCA2504114', name: 'AVISHKAR AVINASH CHAVAN' },
  { roll: 'MCA2504115', name: 'VIJAY SONUNE' },
  { roll: 'MCA2504117', name: 'ABHISHEK KHANZODE' },
  { roll: 'MCA2504118', name: 'SOURABH OZA' },
  { roll: 'MCA2504122', name: 'AYUSH ASHWIN BHARAD' },
  { roll: 'MCA2504123', name: 'PRATYUSH PADILE' },
  { roll: 'MCA2504125', name: 'DESHPANDE MANAS NILESH' },
  { roll: 'MCA2504128', name: 'SUHAS SUDAM POKALE' },
  { roll: 'MCA2504131', name: 'VISHAL KUMAR THAKUR' },
  { roll: 'MCA2504134', name: 'APARNA KURVE' },
  { roll: 'MCA2504136', name: 'ROHAN NAMDEV BHEGADE' },
  { roll: 'MCA2504146', name: 'SAKSHI BADHE' },
  { roll: 'MCA2504150', name: 'UBALE SHWETA SANDESH' },
  { roll: 'MCA2504151', name: 'LOKESH CHINNASWAMI BHANDARI' },
  { roll: 'MCA2504155', name: 'ADITYA SAJEEV' },
  { roll: 'MCA2504159', name: 'CHANDRAKANT KOTTALWAR' },
  { roll: 'MCA2504161', name: 'RUSHIKESH BABASAHEB JAGTAP' },
  { roll: 'MCA2504171', name: 'MITHIL SHAILESH BORSE' },
  { roll: 'MCA2504173', name: 'RAHUL' },
  { roll: 'MCA2504182', name: 'RAVI PUTTHEWAD' }
];

function initializeAttendanceTable(): void {
  const tbody = document.getElementById('attendanceBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  classStudents.forEach((student) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align: center; font-weight: 500;">${student.roll}</td>
      <td><strong>${student.name}</strong></td>
      <td>
        <select class="status-select" data-student-id="${student.roll}" style="width: 100%; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color);">
          <option value="">-- Select --</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

async function submitBulkAttendance(): Promise<void> {
  const attendanceDateInput = document.getElementById('attendanceDate') as HTMLInputElement | null;
  const attendanceDate = attendanceDateInput?.value;

  if (!attendanceDate) {
    alert('Please select a date');
    return;
  }

  const records: Array<{ studentName: string; status: AttendanceStatus; date: string }> = [];

  document.querySelectorAll<HTMLSelectElement>('.status-select').forEach((select) => {
    const status = select.value as AttendanceStatus | '';
    if (!status) return;

    const studentId = select.getAttribute('data-student-id');
    const student = classStudents.find((item) => item.roll === studentId);

    if (student) {
      records.push({
        studentName: student.name,
        status,
        date: new Date(attendanceDate).toISOString()
      });
    }
  });

  if (records.length === 0) {
    alert('Please mark attendance for at least one student');
    return;
  }

  try {
    for (const record of records) {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });

      if (!response.ok) {
        alert(`Error saving attendance for ${record.studentName}`);
        return;
      }
    }

    alert(`Successfully saved attendance for ${records.length} students!`);

    if (attendanceDateInput) attendanceDateInput.value = '';
    initializeAttendanceTable();
    fetchAttendance('studentTable');

    const adminPanel = document.getElementById('admin');
    if (adminPanel?.classList.contains('active')) {
      fetchAttendance('adminTable');
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    alert('Error submitting attendance: ' + message);
  }
}

function showModule(id: 'teacher' | 'student' | 'admin'): void {
  document.querySelectorAll('.module').forEach((module) => module.classList.remove('active'));
  document.querySelectorAll('.nav button').forEach((button) => button.classList.remove('active-btn'));

  const activeModule = document.getElementById(id);
  const activeButton = document.getElementById(`btn-${id}`);

  if (activeModule) activeModule.classList.add('active');
  if (activeButton) activeButton.classList.add('active-btn');

  if (id === 'teacher') {
    initializeAttendanceTable();
  }
}

function getStatusBadge(status: string): string {
  if (status === 'Present') return '<span class="badge badge-present">Present</span>';
  if (status === 'Late') return '<span class="badge badge-absent">Late</span>';
  return '<span class="badge badge-absent">Absent</span>';
}

async function fetchAttendance(tableId: 'studentTable' | 'adminTable'): Promise<void> {
  const response = await fetch('/api/attendance');
  const data: AttendanceRecord[] = await response.json();
  const tbody = document.querySelector(`#${tableId} tbody`);

  if (!tbody) return;

  tbody.innerHTML = '';

  if (data.length === 0) {
    const colspan = tableId === 'adminTable' ? 4 : 3;
    tbody.innerHTML = `<tr><td colspan="${colspan}" style="text-align:center; color:#94a3b8;">No records found</td></tr>`;
    return;
  }

  data.forEach((item) => {
    const statusBadge = getStatusBadge(item.status);
    const row = tableId === 'adminTable'
      ? `<tr>
          <td style="font-family: monospace; font-size: 0.8rem; color: #64748b;">${item._id ?? ''}</td>
          <td><strong>${item.studentName}</strong></td>
          <td>${statusBadge}</td>
          <td>${new Date(item.date).toLocaleString()}</td>
        </tr>`
      : `<tr>
          <td><strong>${item.studentName}</strong></td>
          <td>${statusBadge}</td>
          <td>${new Date(item.date).toLocaleString()}</td>
        </tr>`;

    tbody.insertAdjacentHTML('beforeend', row);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const attendanceDateInput = document.getElementById('attendanceDate') as HTMLInputElement | null;
  const today = new Date().toISOString().split('T')[0];

  if (attendanceDateInput) attendanceDateInput.value = today;
  initializeAttendanceTable();

  const teacherButton = document.getElementById('btn-teacher');
  const studentButton = document.getElementById('btn-student');
  const adminButton = document.getElementById('btn-admin');

  teacherButton?.addEventListener('click', () => showModule('teacher'));
  studentButton?.addEventListener('click', () => showModule('student'));
  adminButton?.addEventListener('click', () => showModule('admin'));

  const submitButton = document.querySelector('.btn-action');
  submitButton?.addEventListener('click', submitBulkAttendance);
});

(window as typeof window & {
  showModule?: typeof showModule;
  submitBulkAttendance?: typeof submitBulkAttendance;
  fetchAttendance?: typeof fetchAttendance;
}).showModule = showModule;
(window as typeof window & {
  showModule?: typeof showModule;
  submitBulkAttendance?: typeof submitBulkAttendance;
  fetchAttendance?: typeof fetchAttendance;
}).submitBulkAttendance = submitBulkAttendance;
(window as typeof window & {
  showModule?: typeof showModule;
  submitBulkAttendance?: typeof submitBulkAttendance;
  fetchAttendance?: typeof fetchAttendance;
}).fetchAttendance = fetchAttendance;
