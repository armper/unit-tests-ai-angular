import type { Meta, StoryObj } from '@storybook/angular';
import { PatientComponent } from './patient.component';
import {  within, userEvent } from '@storybook/testing-library';

const meta: Meta<PatientComponent> = {
    title: 'Patient',
    component: PatientComponent,

};

export default meta;

type Story = StoryObj<PatientComponent>;

export const FilledPatient: Story = {
    args: {
        patient: {
            name: 'John Doe',
            details: 'Patient currently has a broken leg.'
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        // click the edit button <button (click)="toggleEditMode()">Edit</button>
        await userEvent.click(canvas.getByText('Edit'));

        await userEvent.type(canvas.getByTestId('name'), 'Jane Doe');
        await userEvent.type(canvas.getByTestId('details'), 'Details');

        // click the save button
        await userEvent.click(canvas.getByText('Save'));

    }
}