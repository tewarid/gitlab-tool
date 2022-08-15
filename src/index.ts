import './style.css';
import * as ko from 'knockout';
import ProjectsTemplate from './projects.html';
import ProjectsViewModel from './projects';
import SettingsTemplate from './settings.html';
import SettingsViewModel from './settings';
import { ViewModelBase } from './ViewModelBase';

ko.components.register('projects', {
    viewModel: ProjectsViewModel,
    template: ProjectsTemplate
});

ko.components.register('settings', {
    viewModel: SettingsViewModel,
    template: SettingsTemplate
});

class MainViewModel extends ViewModelBase {
    private component: ko.Observable<string>;

    constructor () {
        ViewModelBase.prefix = 'gitlab-tool';
        super();
        this.typeName = 'MainViewModel';
        this.component = ko.observable();
        ViewModelBase.settings = new SettingsViewModel();
        this.showComponent();
    }

    private showComponent (component: string = null) {
        if (component == null) {
            const saved = this.read();
            component = saved.component || 'settings';
        }
        this.component(component);
        this.save();
    }
}

ko.applyBindings(new MainViewModel());
