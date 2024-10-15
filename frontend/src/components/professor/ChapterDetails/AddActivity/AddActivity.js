import React, { useEffect, useState } from 'react';
import { Button, Tab, Tabs, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import FileUpload from './FileUpload';
import { ERROR_OCCURRED } from '../../../../utils/constants';
import Loader from '../../../general/Loader/Loader';
import './AddActivity.css'; // Import pliku CSS

function AddActivity(props) {
    const [formData, setFormData] = useState({});
    const [listKeys, setListKeys] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        props
            .getActivityJson()
            .then((response) => {
                const flattenedData = flattenData(response);
                setFormData(flattenedData.data);
                setListKeys(flattenedData.listKeys);
            })
            .catch((error) => {
                setFormData(null);
                setErrorMessage(error.response.data.message ?? ERROR_OCCURRED);
            });
    }, [props]);

    const handleChange = (key, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const sendFormData = () => {
        const form = unflattenData(formData, listKeys);
        if (form) {
            // Formatowanie list do ciągów oddzielonych przecinkami przed wysłaniem do API
            const formattedForm = {};
            Object.keys(form).forEach((key) => {
                if (Array.isArray(form[key])) {
                    formattedForm[key] = form[key].join(','); // Joinowanie listy do ciągu bez spacji
                } else {
                    formattedForm[key] = form[key];
                }
            });

            props
                .setActivityJson({ chapterId: props.chapterId, form: formattedForm })
                .then(() => {
                    props.onSuccess();
                })
                .catch((error) => {
                    setErrorMessage(error.response?.data?.message ?? ERROR_OCCURRED);
                });
        }
    };

    const renderFormFields = (data) => {
        return Object.keys(data).map((key) => {
            const value = data[key];
            const isReadOnly = key === 'activityType';
            const inputType = typeof value === 'number' ? 'number' : 'text';
            const className = key === 'description' || key === 'infoContent' || key === 'taskContent' ? 'multi-line' : '';

            // Sprawdzenie czy wartość jest listą
            if (Array.isArray(value) || listKeys.includes(key)) {
                // Wyświetlanie wartości listy jako ciąg oddzielony przecinkami
                return (
                    <Form.Group key={key} controlId={key} className="form-group-margin-top">
                        <Form.Label><strong>{key}</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={Array.isArray(value) ? value.join(', ') : value}
                            readOnly={isReadOnly}
                            onChange={(e) => handleChange(key, e.target.value.split(',').map(item => item.trim()))}
                        />
                    </Form.Group>
                );
            } else {
                // Dla pozostałych przypadków, normalne renderowanie
                return (
                    <Form.Group key={key} controlId={key} className="form-group-margin-top">
                        <Form.Label><strong>{key}</strong></Form.Label>
                        <Form.Control
                            as={className ? 'textarea' : 'input'}
                            rows={className ? 3 : undefined}
                            type={!className ? inputType : undefined}
                            value={value}
                            readOnly={isReadOnly}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className={className}
                        />
                    </Form.Group>
                );
            }
        });
    };

    const flattenData = (data) => {
        const result = {};
        const listKeys = [];

        const recurse = (cur, prop) => {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                result[prop] = cur; // Zapisz listę jako całość
                listKeys.push(prop); // Dodaj klucz do listy kluczy zawierających listy
            } else {
                let isEmpty = true;
                for (const p in cur) {
                    isEmpty = false;
                    recurse(cur[p], prop ? `${prop}.${p}` : p);
                }
                if (isEmpty) result[prop] = {};
            }
        };

        recurse(data, '');
        return { data: result, listKeys };
    };

    const unflattenData = (data, listKeys) => {
        if (Object(data) !== data || Array.isArray(data)) return data;
        const result = {};
        const regex = /\.?([^.\[\]]+)|\[(\d+)\]/g;
        for (const p in data) {
            let cur = result;
            let prop = '';
            let m;
            while ((m = regex.exec(p))) {
                cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
                prop = m[2] || m[1];
            }
            cur[prop] = data[p];
        }

        // Konwertuj wartości string z przecinkami z powrotem do list tylko dla określonych kluczy
        listKeys.forEach(key => {
            if (typeof result[key] === 'string' && result[key].includes(',')) {
                result[key] = result[key].split(',').map(item => item.trim());
            }
        });

        return result[''] || result;
    };

    return (
        <div>
            {formData === undefined ? (
                <Loader />
            ) : formData == null ? (
                <p>{errorMessage}</p>
            ) : (
                <>
                    <Tabs defaultActiveKey="editor">
                        <Tab title="Tryb edycji" eventKey="editor">
                            <Form>
                                {renderFormFields(formData)}
                            </Form>
                        </Tab>
                        <Tab title="Dodawanie pliku" eventKey="file-upload">
                            <FileUpload
                                jsonToDownload={unflattenData(formData, listKeys)}
                                setPlaceholderJson={(json) => {
                                    const flattenedData = flattenData(json);
                                    setFormData(flattenedData.data);
                                    setListKeys(flattenedData.listKeys);
                                }}
                                fileName={props.fileName}
                            />
                        </Tab>
                    </Tabs>

                    <div className="d-flex flex-column justify-content-center align-items-center pt-4 gap-2">
                        {errorMessage && (
                            <p style={{ color: props.theme.danger }} className="h6">
                                {errorMessage}
                            </p>
                        )}
                        <div className="d-flex gap-2">
                            <Button
                                style={{
                                    backgroundColor: props.theme.danger,
                                    borderColor: props.theme.danger,
                                }}
                                onClick={props.onCancel}
                            >
                                Anuluj
                            </Button>
                            <Button
                                style={{
                                    backgroundColor: props.theme.success,
                                    borderColor: props.theme.success,
                                }}
                                onClick={sendFormData}
                            >
                                Dodaj aktywność
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function mapStateToProps(state) {
    const { theme } = state;

    return { theme };
}

export default connect(mapStateToProps)(AddActivity);
