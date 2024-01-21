from celery import Celery,Task


def celery_init_app(app):
    class FlaskTask(Task):
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return self.run(*args, **kwargs)
    
    cel=Celery(app.name,task_cls=FlaskTask)
    cel.config_from_object("celeryconfig")
    cel.set_default()
    return cel