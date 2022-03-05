create table users(
    id serial,
    name_user text not null,
    email text not null,
    pass text not null,
    cpf text,
    phone text
);

create table customers(
    id serial primary key,
    name_customer text not null,
    email text not null,
    cpf text not null,
    phone text not null,
    zip_code text,
    address text,
    complement text,
    neighborhood text,
    city text,
    state text,
    status text default 'Em dia'
);

create table charges(
    id serial,
    customerId integer not null,
    name_customer text not null,
    description text not null,
    status text default 'Pendente', 
    value float not null,
    dueDate date not null,
    foreign key (customerId) references customers (id)
);
