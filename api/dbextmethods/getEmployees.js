import sql from 'mssql';
import { config } from '../routes/config.js';


//#region  --- Employee CRUD Methods Start --------------------------
export async function insertEmployees(Employee) {

    try {
        let jsonString = JSON.stringify(Employee);
        await sql.connect(config);
        const request = new sql.Request();
        request.input('jsonData', sql.NVarChar, jsonString);
        const employees = await request.execute("[dbo].[insertEmployee]");
        return await employees.recordsets;
    }
    catch (error) {
        console.log(error);
    }
    return;
}
export async function getEmployees() {

    try {
        const pool = new sql.ConnectionPool(config);
        const poolConnect = pool.connect();
        await poolConnect;
        let employees = await pool.request().query("Select * from Employees");
        return await employees.recordsets;
    }
    catch (error) {
        console.log(error);
    }
    return;
}

export async function getEmployeebyId(Id) {

    try {
        const pool = new sql.ConnectionPool(config);
        const poolConnect = pool.connect();
        await poolConnect;
        console.log("Select * from Employees where EmpId="+Id);
        let employees = await pool.request().query("Select * from Employees where EmpId="+Id);
        return await employees.recordsets;
    }
    catch (error) {
        console.log(error);
    }
    return;
}

export async function updateEmployees(Employee) {

    try {
        let jsonString = JSON.stringify(Employee);
        await sql.connect(config);
        const request = new sql.Request();
        request.input('jsonData', sql.NVarChar, jsonString);
        const employees = await request.execute("[dbo].[updateEmployee]");
        return await employees.recordsets;
    }
    catch (error) {
        console.log(error);
    }
    return;
}

export async function deleteEmployees(Id) {

    try {
        const pool = new sql.ConnectionPool(config);
        const poolConnect = pool.connect();
        await poolConnect;
        let employees = await pool.request().query("Delete from Employees where EmpId="+Id);        
        return await employees.recordsets;
    }
    catch (error) {
        console.log(error);
    }
    return;
}


//#endregion --- Employee CRUD Methods End --------------------------

