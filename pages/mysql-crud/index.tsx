import React, { useEffect, useRef, useState } from "react";
import { UserService } from "./UserService";
import { User } from "./UserType";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';
import { Column } from "primereact/column";
import { useRouter } from "next/navigation";



export default function MysqlCrud() {

    let emptyUser: User = {
        id: '',
        username: '',
        email: ''
    };

    const [users, setUsers] = useState<User[]>([]);
    const [user, setUser] = useState<User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [submitted, setSubmitted] = useState(false);
    const [userDialog, setUserDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState('');
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);



    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<User[]>>(null);
    const router = useRouter()




    useEffect(() => {
        UserService.getUsers().then((data) => setUsers(data));
    }, []);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} />
                </div>
            </React.Fragment>
        );
    };
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const onInputChangeUsername = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user['username'] = val;
        setUser(_user);
    };
    const onInputChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user['email'] = val;
        setUser(_user);
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Users</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );
    const codeBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Username</span>
                {rowData.username}
            </>
        );
    };

    const nameBodyTemplate = (rowData: User) => {
        return (
            <>
                <span className="p-column-title">Email</span>
                {rowData.email}
            </>
        );
    };
    const actionBodyTemplate = (rowData: User) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => confirmDeleteUser(rowData)} />
            </>
        );
    };

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };
    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };
    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const confirmDeleteSelected = () => {
        // setDeleteProductsDialog(true);
    };
    const saveProduct = () => {
        setSubmitted(true);
        console.log(user);

        if (user.username.trim() && user.email.trim()) {
            if (user.id !== '') {
                UserService.updateUser(user).then((data) => {
                    // router.refresh()
                    console.log(data);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
                    setUsers(data)
                })
            } else {

                UserService.createUser(user).then((data) => {
                    // router.refresh()
                    console.log(data);
                    toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
                    setUsers(data)
                })
            }

            setUserDialog(false);
            setUser(emptyUser);
        }





    }
    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };
    const deleteProduct = () => {
        // let _users = users.filter((val) => val.id !== user.id);

        UserService.deleteUser(user).then((data) => {
            setUsers(data);
            setDeleteUserDialog(false);
            setUser(emptyUser);
            toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        })

    };
    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };


    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );
    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedUsers}
                        onSelectionChange={(e) => setSelectedUsers(e.value as User[])}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="username" header="Username" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>

                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        {/* {product.image && <img src={`/demo/images/product/${product.image}`} alt={product.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />} */}

                        <div className="field">
                            <label htmlFor="name">User Name</label>
                            <InputText id="name" value={user.username} onChange={(e) => onInputChangeUsername(e)} required autoFocus className={classNames({ 'p-invalid': submitted && !user.username })} />
                            {submitted && !user.username && <small className="p-invalid">User Name is required.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <InputText id="name" value={user.email} onChange={(e) => onInputChangeEmail(e)} required className={classNames({ 'p-invalid': submitted && !user.email })} />
                            {submitted && !user.email && <small className="p-invalid">Email is required.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.username}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUsersDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
