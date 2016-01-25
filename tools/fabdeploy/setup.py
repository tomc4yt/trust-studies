from setuptools import setup
import sys

setup(
    name="fabdeploy",
    version="0.1.0",
    install_requires=[
        "fabric"
    ],
    scripts=['bin/deploy'],
    data_files=[('/etc/fabdeploy', ['etc/deploy.cfg']),
                ('/var/lib/fabdeploy',['lib/fabfile.py'])]
)