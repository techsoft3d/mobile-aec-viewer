function WalkOperator(viewer) {
    this._viewer = viewer;
}

WalkOperator.prototype.horizontalRotation = function (angle) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();
    var up = camera.getUp();
    var vZ = new Communicator.Point3(0, 0, 1);
    
    var matrixR = new Communicator.Matrix.createFromOffAxisRotation(vZ, angle);
    
    var point = new Communicator.Point3(
        target.x - position.x,
        target.y - position.y,
        target.z - position.z);

    matrixR.transform(point, target);
    target.x += position.x;
    target.y += position.y;
    target.z += position.z;
    
    var newUp = new Communicator.Point3(0, 0, 0);
    matrixR.transform(up, newUp);

    camera.setTarget(target);
    camera.setUp(newUp);
    
    _this._viewer.getView().setCamera(camera);
};

WalkOperator.prototype.verticalRotation = function (angle) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();
    var vZ = new Communicator.Point3(0, 0, 1);
    var ray = Communicator.Point3.subtract(target, position).normalize();
    var cross = Communicator.Point3.cross(vZ, ray);           
    var matrixR = new Communicator.Matrix.createFromOffAxisRotation(cross, angle);

    var point = new Communicator.Point3(
        target.x - position.x,
        target.y - position.y,
        target.z - position.z);

    matrixR.transform(point, target);
    target.x += position.x;
    target.y += position.y;
    target.z += position.z;

    camera.setTarget(target);
    _this._viewer.getView().setCamera(camera);
};

WalkOperator.prototype.walkFoward = function (dist) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();

    var vector = Communicator.Point3.subtract(target, position).normalize();
    position.x += vector.x * dist;
    position.y += vector.y * dist;
    target.x += vector.x * dist;
    target.y += vector.y * dist;
    
    camera.setPosition(position);
    camera.setTarget(target);

    _this._viewer.getView().setCamera(camera, 400);
}

WalkOperator.prototype.walkCrab = function (dist) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();
    var vZ = new Communicator.Point3(0, 0, 1);

    var ray = Communicator.Point3.subtract(target, position).normalize();
    var cross = Communicator.Point3.cross(vZ, ray);
    position.x += cross.x * dist;
    position.y += cross.y * dist;
    target.x += cross.x * dist;
    target.y += cross.y * dist;
    camera.setPosition(position);
    camera.setTarget(target);

    _this._viewer.getView().setCamera(camera, 600);    
}

WalkOperator.prototype.gotoUpstair = function (dist) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();

    position.z += dist;
    target.z += dist;
    camera.setPosition(position);
    camera.setTarget(target);

    _this._viewer.getView().setCamera(camera, 500);    
}

WalkOperator.prototype.walkByStepping = function () {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();
    
    var vector = Communicator.Point3.subtract(target, position).normalize();
    var dist = 1000;
    if (Math.abs(vector.x) > Math.abs(vector.y)) {
        var v = new Communicator.Point3(1, 0, 0);
        if (vector.x > 0) {
            _this.walk(v, dist);
        } else {
            _this.walk(v, -dist);
        }
    } else {
        var v = new Communicator.Point3(0, 1, 0);
        if (vector.y > 0) {
            _this.walk(v, dist);
        } else {
            _this.walk(v, -dist);
        }
    }
}

WalkOperator.prototype.walk = function (vector, dist) {
    var _this = this;
    var camera = _this._viewer.getView().getCamera();
    var position = camera.getPosition();
    var target = camera.getTarget();
    
    position.x += vector.x * dist;
    position.y += vector.y * dist;
    target.x += vector.x * dist;
    target.y += vector.y * dist;
    
    camera.setPosition(position);
    camera.setTarget(target);
    
    _this._viewer.getView().setCamera(camera, 500);
}