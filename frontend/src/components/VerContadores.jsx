import React, { useEffect, useMemo, useState } from 'react';
import AxiosInstance from './Axios';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, MenuItem, Select } from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import VerProgramacion from './VerProgramacion';
import AsignarProgramacion from './AsignarProgramacion';
import InformacionContador from './InformacionContador';

const VerContadores = () => {
    const [myData, setMyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContador, setSelectedContador] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState('InformacionContador');
    const [selectedSerialNumber, setSelectedSerialNumber] = useState('');


    useEffect(() => {
        getData();
    }, []);


    const getData = () => {
        AxiosInstance.get('contador/')
            .then(response => {
                setMyData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener datos:', error);
            });
    };

    const handleCellClick = (contador) => {
        const hasProgramaciones = contador.programaciones && contador.programaciones.length > 0;

        setSelectedContador(contador);
        setSelectedSerialNumber(contador.num_serie);
        setShowDetails(true);
    };

    const handleComponentChange = (event) => {
        setSelectedComponent(event.target.value);
    };

    const handleCellClickWithData = (contador) => {
        setSelectedContador(contador);
        setShowDetails(true);
    };

    const handleCellClickWithoutData = (contador) => {
        setSelectedContador(contador);
        setShowDetails(false);
    };

    const columns = useMemo(() => [
        {
            accessorKey: 'ip',
            header: 'IP',
            size: 150,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'num_serie',  // Agregar el accessorKey para el campo num_serie
            header: 'Número de Serie',  // Definir el encabezado
            size: 150,  // Definir el tamaño de la celda
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'protocolo',
            header: 'Protocolo',
            size: 30,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'puerto',
            header: 'Puerto',
            size: 50,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'direccion_enlace',
            header: 'Dirección de Enlace',
            size: 150,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'punto_medida',
            header: 'Punto de Medida',
            size: 50,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'clave_lectura',
            header: 'Clave de Lectura',
            size: 50,
            Cell: ({ cell }) => (
                <div onClick={() => handleCellClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'programaciones',
            header: 'ID de Programación',
            size: 50,
            Cell: ({ cell }) => {
                const programaciones = cell.row.original.programaciones;

                if (!programaciones || programaciones.length === 0) {
                    return (
                        <div onClick={() => handleCellClick(cell.row.original)}>
                            Ninguna
                        </div>
                    );
                }

                const programacionesString = programaciones.join(', ');
                return (
                    <div onClick={() => handleCellClick(cell.row.original)}>
                        {programacionesString}
                    </div>
                );
            },
        },
    ], []);

    useEffect(() => {
        if (selectedContador && selectedContador.id) {
            AxiosInstance.get(`programacion/${selectedContador.id}/`)
                .then(response => {
                    setProgramaciones(response.data);
                })
                .catch(error => {
                    console.error('Error al obtener la programación:', error);
                });
        }
    }, [selectedContador]);

    return (
        <div>
            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <>
                    <MaterialReactTable
                        columns={columns}
                        data={myData}
                        enableRowActions
                        renderRowActions={({ row }) => (
                            <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                                <IconButton color="secondary" component={Link} to={`edit/${row.original.id}`}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton color="error" component={Link} to={`delete/${row.original.id}`}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        )}
                    />
                    {showDetails && selectedContador && (
                        <>
                            <h3>Contador seleccionado:</h3>
                            <p>IP: {selectedContador.ip}</p>
                            <Select value={selectedComponent} onChange={handleComponentChange}>
                                <MenuItem value="InformacionContador">InformacionContador</MenuItem>
                                <MenuItem value="VerProgramacion">VerProgramacion</MenuItem>
                            </Select>
                            {selectedComponent === 'VerProgramacion' && (
                                <VerProgramacion id={selectedContador.id} updateData={getData} />
                            )}
                            {selectedComponent === 'InformacionContador' && (
                                <InformacionContador serialNumber={selectedContador.num_serie} />
                            )}
                           
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default VerContadores;