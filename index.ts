interface Unit {
  unitCode: string;
  unitName: string;
  session: string;
  level: string;
  enrolment: number;
}

let units: Unit[] = [];

/**
 * display unit list
 */
function getUnitList() {
  units.forEach((unit) => {
    addTableRow(unit);
  });
}

/**
 * add table row
 * @param unit 
 */
function addTableRow(unit: Unit) {
  const table: HTMLTableElement = <HTMLTableElement>document.getElementById('unitList');
  const row: HTMLTableRowElement = <HTMLTableRowElement>table.insertRow(table.rows.length);
  
  addTableColumn(row, `${table.rows.length - 1}`);
    
  for (const key in unit) {
    addTableColumn(row, unit[key]);
  }

  const action = row.insertCell(row.cells.length);
  const deleteBtn = `<button onclick="editUnit(${table.rows.length - 1})">Edit</button>` +
    `<button onclick="deleteUnit(${table.rows.length - 1})">Delete</button>`;
  action.innerHTML = deleteBtn;
}

/**
 * add table cell
 * @param row 
 * @param content 
 */
function addTableColumn(row: HTMLTableRowElement, content: string) {
  const cell = row.insertCell(row.cells.length);
  cell.innerHTML = content;
}

/**
 * submit add unit form
 */
function submitForm() {
  const unit: Unit = getFormValue();
  if(formInvalid(unit)){
    return;
  }
  addUnit(unit);
  document.forms['unitForm'].reset();
  displayMessage('Unit added successfully', 'success');
}

/**
 * returns form value
 * @returns {Unit}
 */
function getFormValue():Unit {
  const unitCode = document.forms['unitForm']['unitCode'].value;
  const unitName = document.forms['unitForm']['unitName'].value;
  const session = document.forms['unitForm']['session'].value;
  const level = document.forms['unitForm']['level'].value;
  const enrolment = document.forms['unitForm']['enrolment'].value;
  return { unitCode, unitName, session, level, enrolment };
}

/**
 * validates form
 * @param unit 
 * @returns {boolean}
 */
function formInvalid(unit: Unit):boolean {
  if(!unit.unitCode) {
    displayMessage('Unit Code field required', 'danger');
    return true;
  }
  if(!unit.unitCode.match('^[a-zA-Z]{3}[0-9]{5}')) {
    displayMessage('Unit Code must contain 3 alphabets followed by 5 digits, e.g. CSC17030', 'danger');
    return true;
  }
  if(!unit.unitName) {
    displayMessage('Unit Name field required', 'danger');
    return true;
  }
  if(!unit.session) {
    displayMessage('Session field required', 'danger');
    return true;
  }
  if(!unit.level) {
    displayMessage('Level field required', 'danger');
    return true;
  }
  if(!unit.enrolment) {
    displayMessage('Enrolment field required', 'danger');
    return true
  }
  if(!(unit.enrolment).toString().match('^(0|[1-9][0-9]*)$')) {
    displayMessage('Enrolment must be 0 or greater integer', 'danger');
    return true;
  }
  return false;
}

/**
 * add unit to unit
 * @param data 
 */
function addUnit(data: Unit) {
  units.push(data);
  addTableRow(data);
}

/**
 * executes on edit button onclick event
 * @param rowIndex 
 */
function editUnit(rowIndex: number) {
  document.getElementById('addBtn').style.display = 'none';
  const form = document.getElementById('unitForm');
  const editBtn = document.createElement('button'); 
  editBtn.setAttribute('id', 'editBtn');
  editBtn.innerHTML = 'Update';
  editBtn.setAttribute('onclick', `event.preventDefault();updateUnit(${rowIndex})`);
  form.appendChild(editBtn); 
  setFormValue(rowIndex - 1);
  document.getElementById('title').innerHTML = 'Update Unit';
}

/**
 * sets form value
 * @param index 
 */
function setFormValue(index: number) {
  const form = document.forms['unitForm'];
  form['unitCode'].value = units[index].unitCode;
  form['unitName'].value = units[index].unitName;
  form['session'].value = units[index].session;
  form['level'].value = units[index].level;
  form['enrolment'].value = units[index].enrolment;
}

/**
 * update unit to units
 * @param rowIndex 
 * @param data 
 */
function updateUnit(rowIndex: number) {
  const unit: Unit = getFormValue();
  if(formInvalid(unit)){
    return;
  }
  updateTableRow(rowIndex, unit);
  units[rowIndex - 1] = unit;
  displayMessage('Unit updated successfully', 'success');
  document.forms['unitForm'].reset();
  document.getElementById('editBtn').remove();
  document.getElementById('addBtn').style.display = 'block';
  document.getElementById('title').innerHTML = 'Add New Unit';
}

/**
 * updates specific table row data
 * @param rowIndex 
 * @param data 
 */
function updateTableRow(rowIndex: number, unit: Unit) {
  const table: HTMLTableElement = <HTMLTableElement>document.getElementById('unitList');
  const row = table.rows[rowIndex];
  let i:number = 0;
  let cell = row.cells[i];
  cell.innerHTML = `${rowIndex}`;
  i++;
  for(let key in unit) {
    cell = row.cells[i];
    cell.innerHTML = unit[key];
    i++;
  }
}

/**
 * delete unit from units
 * @param rowIndex 
 */
function deleteUnit(rowIndex: number) {
  const bool: Boolean = confirm('delete: ' + rowIndex);
  if(bool) {
    const table = <HTMLTableElement>document.getElementById('unitList');
    table.deleteRow(rowIndex);
    units.splice(rowIndex - 1, 1);
    displayMessage('Unit deleted successfully', 'success');
  }
}

/**
 * display messages and hides in 10sec
 * @param message 
 */
function displayMessage(message: string, type: string) {
  const messageDiv = <HTMLElement>document.getElementById('message');
  messageDiv.innerHTML = message;
  messageDiv.setAttribute('role', 'alert');
  messageDiv.setAttribute('class', `alert alert-${type}`);
  messageDiv.style.display = 'block';
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 10000);
}