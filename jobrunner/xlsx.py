import json
from io import BytesIO

import bmds
import xlsxwriter


class XLSXGeneratorBaseClass(object):
    # Abstract base-class for generating an Excel workbook.

    def __init__(self, content):
        self.content = content

    def _setup_wb(self):
        self.f = BytesIO()
        self.wb = xlsxwriter.Workbook(self.f)
        self.bolded = self.wb.add_format({'bold': True})

    def get_fn(self):
        raise NotImplemented('Should return valid filename string')

    def write_content():
        raise NotImplemented('Should add any content to workbook')

    def _return_wb(self):
        self.wb.close()
        content = self.f.getvalue()
        self.f.close()
        return content

    def get_xlsx(self):
        # Return filename and bytes content from workbook
        self._setup_wb()
        self.write_content()
        return self.get_fn(), self._return_wb()


class BMDGenerator(XLSXGeneratorBaseClass):

    def __init__(self, content):
        super(BMDGenerator, self).__init__(content)
        self.content = json.loads(self.content)

    def get_fn(self):
        id_ = self.content['inputs'].get('id', self.content['job_id'])
        return '{}.xlsx'.format(id_)

    def write_content(self):
        self._write_datasets()
        self._write_inputs()
        self._write_models()

    @property
    def dtype(self):
        if not hasattr(self, '_dtype'):
            self._dtype = self.content['inputs']['dataset_type']
        return self._dtype

    @property
    def has_recommended(self):
        if not hasattr(self, '_has_recommended'):
            self._has_recommended = 'recommended_model_index' in self.content['outputs'][0]
        return self._has_recommended

    def _write_datasets(self):
        ws = self.wb.add_worksheet('datasets')
        ws.freeze_panes(1, 0)

        if self.dtype in bmds.constants.DICH_DTYPES:
            headers = ('dataset_id', 'Dose', 'N', 'Incidence')
        else:
            headers = ('dataset_id', 'Dose', 'N', 'Response', 'Stdev')

        # write header
        for i, txt in enumerate(headers):
            ws.write(0, i, txt, self.bolded)

        # write datasets
        r = 0
        datasets = [d['dataset'] for d in self.content['outputs']]
        for i, dataset in enumerate(datasets):
            for j in range(len(dataset['doses'])):
                r += 1
                ws.write(r, 0, dataset.get('id', i))
                ws.write(r, 1, dataset['doses'][j])
                ws.write(r, 2, dataset['ns'][j])
                if self.dtype in bmds.constants.DICH_DTYPES:
                    ws.write(r, 3, dataset['incidences'][j])
                else:
                    ws.write(r, 3, dataset['responses'][j])
                    ws.write(r, 4, dataset['stdevs'][j])

        ws.autofilter(0, 0, r, len(headers) - 1)

    def _write_inputs(self):
        ws = self.wb.add_worksheet('inputs')

        # write job ID
        ws.write(0, 0, 'Job ID', self.bolded)
        ws.write(0, 1, self.content['job_id'])

        # write user-defined run ID if available
        ws.write(1, 0, 'Run ID', self.bolded)
        ws.write(1, 1, self.content['inputs'].get('id', None))

        # write original inputs w/ datasets
        self.content['inputs']['datasets'] = [
            ds['dataset'] for ds in self.content['outputs']
        ]
        ws.write(2, 0, 'Input settings', self.bolded)
        txt = json.dumps(self.content['inputs'], indent=2)
        ws.write(2, 1, txt)

    model_header_general = ('dataset_id', 'model_name', 'has_output')
    model_header_logic = (
        'recommended', 'recommended_variable', 'logic_bin',
        'logic_cautions', 'logic_warnings', 'logic_failures',
    )

    model_header_c = (
        'model_version', 'BMD', 'BMDL',
        'AIC', 'pvalue1', 'pvalue2', 'pvalue3', 'pvalue4',
        'Chi2', 'df', 'residual_of_interest',
        'warnings', 'dfile', 'outfile',
    )

    model_header_d = (
        'model_version', 'BMD', 'BMDL', 'BMDU',
        'AIC', 'pvalue', 'Chi2', 'df', 'residual_of_interest',
        'warnings', 'dfile', 'outfile',
    )

    model_header_dc = (
        'model_version', 'BMD', 'BMDL', 'BMDU', 'CSF',
        'AIC', 'pvalue', 'Chi2', 'df', 'residual_of_interest',
        'warnings', 'dfile', 'outfile',
    )

    def _write_models(self):
        ws = self.wb.add_worksheet('models')
        ws.freeze_panes(1, 0)

        # write header
        headers = []
        headers.extend(self.model_header_general)

        if self.dtype == bmds.constants.CONTINUOUS:
            headers.extend(self.model_header_c)
        elif self.dtype == bmds.constants.DICHOTOMOUS:
            headers.extend(self.model_header_d)
        elif self.dtype == bmds.constants.DICHOTOMOUS_CANCER:
            headers.extend(self.model_header_dc)
        else:
            raise ValueError('Unknown dtype')

        if self.has_recommended:
            headers.extend(self.model_header_logic)

        for i, txt in enumerate(headers):
            ws.write(0, i, txt, self.bolded)

        # write datasets
        r = 0
        for i, output in enumerate(self.content['outputs']):
            for model in output['models']:
                op = model.get('output')
                r += 1

                # general content
                ws.write(r, 0, output['dataset'].get('id', i))
                ws.write(r, 1, model['name'])
                ws.write(r, 2, model['has_output'])

                # output content
                if op:
                    if self.dtype == bmds.constants.CONTINUOUS:
                        ws.write(r, 3, op['model_version'])
                        ws.write(r, 4, op['BMD'])
                        ws.write(r, 5, op['BMDL'])
                        ws.write(r, 6, op['AIC'])
                        ws.write(r, 7, op['p_value1'])
                        ws.write(r, 8, op['p_value2'])
                        ws.write(r, 9, op['p_value3'])
                        ws.write(r, 10, op['p_value4'])
                        ws.write(r, 11, op['Chi2'])
                        ws.write(r, 12, op['df'])
                        ws.write(r, 13, op['residual_of_interest'])
                        ws.write(r, 14, '\n'.join(op['warnings']))
                        ws.write(r, 15, model['dfile'])
                        ws.write(r, 16, model['outfile'])

                    elif self.dtype == bmds.constants.DICHOTOMOUS:
                        ws.write(r, 3, op['model_version'])
                        ws.write(r, 4, op['BMD'])
                        ws.write(r, 5, op['BMDL'])
                        ws.write(r, 6, op['BMDU'])
                        ws.write(r, 7, op['AIC'])
                        ws.write(r, 8, op['p_value4'])
                        ws.write(r, 9, op['Chi2'])
                        ws.write(r, 10, op['df'])
                        ws.write(r, 11, op['residual_of_interest'])
                        ws.write(r, 12, '\n'.join(op['warnings']))
                        ws.write(r, 13, model['dfile'])
                        ws.write(r, 14, model['outfile'])

                    elif self.dtype == bmds.constants.DICHOTOMOUS_CANCER:
                        ws.write(r, 3, op['model_version'])
                        ws.write(r, 4, op['BMD'])
                        ws.write(r, 5, op['BMDL'])
                        ws.write(r, 6, op['BMDU'])
                        ws.write(r, 7, op['CSF'])
                        ws.write(r, 8, op['AIC'])
                        ws.write(r, 9, op['p_value4'])
                        ws.write(r, 10, op['Chi2'])
                        ws.write(r, 11, op['df'])
                        ws.write(r, 12, op['residual_of_interest'])
                        ws.write(r, 13, '\n'.join(op['warnings']))
                        ws.write(r, 14, model['dfile'])
                        ws.write(r, 15, model['outfile'])

                    else:
                        raise ValueError('Unknown dtype')

                # logic content
                if self.has_recommended:
                    offset = headers.index('recommended')
                    ws.write(r, offset + 0, model['recommended'])
                    ws.write(r, offset + 1, model['recommended_variable'])
                    ws.write(r, offset + 2, model['logic_bin'])
                    ws.write(r, offset + 3, '\n'.join(model['logic_notes']['0']))
                    ws.write(r, offset + 4, '\n'.join(model['logic_notes']['1']))
                    ws.write(r, offset + 5, '\n'.join(model['logic_notes']['2']))

        ws.autofilter(0, 0, r, len(headers) - 1)
