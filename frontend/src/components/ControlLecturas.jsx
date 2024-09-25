import React, { useEffect, useMemo, useState } from 'react';
import AxiosInstance from './Axios';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import AsignarContadores from './AsignarContadores';

const ControlLecturas = () => {
    const [programaciones, setProgramaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProgramacion, setSelectedProgramacion] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [error, setError] = useState(null);

    // Función para obtener datos de programaciones desde el backend
    const fetchProgramaciones = async () => {
        try {
            const response = await AxiosInstance.get('programacion/');
            setProgramaciones(response.data);
        } catch (error) {
            console.error('Error al obtener datos de programaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Obtener datos de programaciones al cargar el componente
        fetchProgramaciones();
    }, []);

    // Definir columnas para MaterialReactTable
    const columns = useMemo(() => [
        {
            accessorKey: 'nombre',
            header: 'Nombre',
            Cell: ({ cell }) => (
                <div onClick={() => handleRowClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'fecha_inicio',
            header: 'Fecha de Inicio',
            Cell: ({ cell }) => (
                <div onClick={() => handleRowClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'fecha_fin',
            header: 'Fecha de Fin',
            Cell: ({ cell }) => (
                <div onClick={() => handleRowClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'periodo',
            header: 'Periodo',
            Cell: ({ cell }) => (
                <div onClick={() => handleRowClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'accion',
            header: 'Acción',
            Cell: ({ cell }) => (
                <div onClick={() => handleRowClick(cell.row.original)}>
                    {cell.getValue()}
                </div>
            ),
        },
        {
            accessorKey: 'contadores',
            header: 'Contadores Asociados',
            Cell: ({ cell }) => {
                const contadores = cell.getValue();
                return (
                    <div onClick={() => handleRowClick(cell.row.original)}>
                        {Array.isArray(contadores) && contadores.length > 0 ? contadores.join(', ') : 'Ninguno'}
                    </div>
                );
            },
        },
    ], []);

    // Función para manejar clics en filas
    const handleRowClick = (programacion) => {
        setSelectedProgramacion(programacion);
        setShowDetails(true);
    };

    // Función de callback para manejar cambios en los contadores asignados
    const handleContadoresChange = async (newContadores) => {
        try {
            await fetchProgramaciones(); // Volver a cargar las programaciones
        } catch (error) {
            console.error('Error al recargar datos de programaciones:', error);
        }
    };

    return (
        <div>
            {loading ? (
                <p>Cargando datos...</p>
            ) : (
                <>
                    {error && <Alert severity="error">{error}</Alert>}
                    <MaterialReactTable
                        columns={columns}
                        data={programaciones}
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
                    {showDetails && selectedProgramacion && (
                        <AsignarContadores
                            id={selectedProgramacion.id}
                            onContadoresChange={fetchProgramaciones}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ControlLecturas;
