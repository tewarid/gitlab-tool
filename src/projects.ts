import {Gitlab} from "@gitbeaker/browser";
import * as ko from "knockout";
import { ViewModelBase } from "./ViewModelBase";

class ProjectsViewModel extends ViewModelBase {
    public projects: ko.ObservableArray<any>;
    public milestones: ko.ObservableArray<any>;
    public busy: ko.Observable<boolean>;
    public projectsVisible: ko.Observable<boolean>;
    public milestonesVisible: ko.Observable<boolean>;
    public search: ko.Observable<string>;

    constructor() {
        super();
        this.typeName = "ProjectsViewModel";
        const saved = this.read();
        this.projects = ko.observableArray(saved.projects);
        this.milestones = ko.observableArray(saved.milestones);
        this.busy = ko.observable(false);
        this.projectsVisible = ko.observable(saved.projectsVisible !== undefined
            ? saved.projectsVisible : true);
        this.milestonesVisible = ko.observable(saved.milestonesVisible !== undefined
            ? saved.milestonesVisible : false);
        this.search = ko.observable(saved.search);
    }

    public query() {
        this.busy(true);
        const api = new Gitlab({
            host: ViewModelBase.settings.host(),
            token: ViewModelBase.settings.token(),
        });
        api.Projects.all({
            search: this.search(),
        })
        .then((projects: any) => {
            this.projects.removeAll();
            this.milestones.removeAll();
            const promises: any = [];
            projects.forEach((p: any) => {
                this.projects.push({http_url_to_repo: p.http_url_to_repo, id: p.id,
                    name: p.name, namespace: p.namespace,
                    ssh_url_to_repo: p.ssh_url_to_repo});
                const promise = api.ProjectMilestones.all(p.id);
                promises.push(promise);
                promise.then((milestones: any) => {
                    milestones.forEach((m: any) => {
                        this.milestones.push({due_date: m.due_date, id: m.id,
                            projectName: p.name, start_date: m.start_date,
                            state: m.state, title: m.title});
                    });
                });
            });
            Promise.all(promises).then((values) => {
                this.save();
                this.busy(false);
            }, (reason) => {
                this.save();
                this.busy(false);
            });
        }, (reason) => {
            // do nothing
        });
    }

    public viewProjects(e: HTMLLinkElement) {
        this.projectsVisible(true);
        this.milestonesVisible(false);
        this.save();
    }

    public viewMilestones(e: HTMLLinkElement) {
        this.projectsVisible(false);
        this.milestonesVisible(true);
        this.save();
    }
}

export = ProjectsViewModel;
